/**
 * TravelMap
 * Copyright (C) 2023 Amir Czwink (amir130@hotmail.de)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * */
import { Component, Injectable, JSX_CreateElement } from "acfrontend";
import { APIService } from "../APIService";
import { Location } from "../../dist/api";

interface CountryDistributionEntry
{
    twoLetterCountryCode: string;
    count: number;
    weight: number;
}

@Injectable
export class CountriesMap extends Component<{ locationIds: string[]; }>
{
    constructor(private apiService: APIService)
    {
        super();
    }
    
    protected Render()
    {
        return <div id="countriesMap" style="width: 100%; height: 80vh;" />;
    }

    //Private methods
    private async ComputeCountryDistribution(locations: Location[])
    {
        const countries = await locations.Values().Map(async location => {
            const response = await this.apiService.countries._any_.get(location.address.country_code);
            return response.data;
        }).PromiseAll();
        const distribution = countries.Values().GroupBy(x => x.name).Map(kv => {
            const res: CountryDistributionEntry = {
                count: kv.value.length,
                twoLetterCountryCode: kv.value[0].cca2.toLowerCase(),
                weight: 0
            };
            return res;
        }).ToArray();

        const maxCount = Math.max(...distribution.Values().Map(x => x.count).ToArray());
        for (const entry of distribution)
        {
            entry.weight = entry.count / maxCount;
        }

        return distribution;
    }

    private GenerateScaledColor(weight: number)
    {
        const leastColor = [0x30, 0x65, 0x96];
        const fullColor = [0x0f, 0xa0, 0xfa];

        const base = this.MixColors(leastColor, [0xdd, 0xdd, 0xdd], 0.5);
        const [r, g, b] = this.MixColors(fullColor, base, weight);

        const ri = Math.round(r);
        const gi = Math.round(g);
        const bi = Math.round(b);

        const components = [ri, gi, bi].join(", ");
        return "rgb(" + components + ")";
    }

    private MixColors(col1: number[], col2: number[], weight: number)
    {
        const r = (col1[0] * weight) + (1-weight) * col2[0];
        const g = col1[1] * weight + (1-weight) * col2[1];
        const b = col1[2] * weight + (1-weight) * col2[2];

        return [r, g, b];
    }

    private async QueryLocations()
    {
        const locations = await this.input.locationIds.Values().Map(async id => {
            const location = await this.apiService.locations._any_.get(id);
            return location.data;
        }).PromiseAll();

        return locations;
    }

    private async RemountMap()
    {
        const d3 = (window as any).d3;
        const Datamap = (window as any).Datamap;

        const mountPoint = document.getElementById('countriesMap')!;
        while(mountPoint.firstChild !== null)
        {
            mountPoint.removeChild(mountPoint.firstChild);
        }

        const mod = await require("country-iso-2-to-3");
        function cc2tocc3(x: string)
        {
            return mod(x.toUpperCase());
        }

        const locations = await this.QueryLocations();
        const distribution = await this.ComputeCountryDistribution(locations);

        const fillLookup = distribution.Values().ToDictionary(x => x.twoLetterCountryCode, x => x.count);

        const fills = distribution.Values().ToDictionary(x => "fill" + x.count, x => this.GenerateScaledColor(x.weight));
        fills.defaultFill = '#dddddd';
        
        const data: any = {};
        locations.forEach(x => data[cc2tocc3(x.address.country_code)] = {
            fillKey: "fill" + fillLookup[x.address.country_code]
        });

        const lat = 20;
        const long = 50;

        new Datamap({
            element: mountPoint,
            data,
            fills,
            geographyConfig: {
                borderColor: '#444',
                borderWidth: 0.5,
                highlightOnHover: false,
                popupOnHover: false
            },
            setProjection: function (element: any) {
                var projection = d3.geo.mercator()
                    .center([lat, long])
                    .scale(500);
                var path = d3.geo.path().projection(projection);
                return { path: path, projection: projection };
            }
        });
    }

    //Event handlers
    override OnInitiated(): void
    {
        setTimeout(this.RemountMap.bind(this), 100);
    }

    override OnInputChanged(): void
    {
        this.RemountMap();
    }
}
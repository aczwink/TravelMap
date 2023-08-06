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

import { Injectable, Lock } from "acts-util-node";
import { OSMGeocodingService, OSM_Location } from "./OSMGeocodingService";
import { Dictionary } from "acts-util-core";
import { Country, RestCountriesService } from "./RestCountriesService";

interface Location
{
    id: string;
    displayName: string;
    latitude: string;
    longitude: string;
    type: "city" | "country" | "region" | "village" | "unknown";
    internalType: string;
    twoLetterCountryCode: string;
}

@Injectable
export class GeocodingService
{
    constructor(private osmGeocodingService: OSMGeocodingService, private restCountriesService: RestCountriesService)
    {
        this.countryCacheLock = new Lock;
        this.locationSearchCache = {};
        this.lookupLocationCache = {};
    }

    //Public methods
    public async ResolveCountry(twoLetterCountryCode: string)
    {
        const releaser = await this.countryCacheLock.Lock();
        if(this.countryCache === undefined)
        {
            const countries = await this.restCountriesService.FetchCountries();
            this.countryCache = countries.Values().ToDictionary(x => x.cca2.toLowerCase(), x => x);
        }
        releaser.Release();
        return this.countryCache[twoLetterCountryCode.toLowerCase()]!;
    }

    public async ResolveLocation(locationId: string)
    {
        if(!(locationId in this.lookupLocationCache))
        {
            const parts = locationId.split(":");
            const parts2 = parts[1].split("/");
            const result = await this.osmGeocodingService.ResolveLocation(parts2[0] as any, parseInt(parts2[1]));
            this.lookupLocationCache[locationId] = this.MapOSM_Location(result)!;
        }
        
        return this.lookupLocationCache[locationId]!;
    }

    public async SearchForLocation(name: string)
    {
        if(!(name in this.locationSearchCache))
        {
            const result = await this.osmGeocodingService.FreeSearch(name);
            this.locationSearchCache[name] = result.Values().Map(this.MapOSM_Location.bind(this)).NotNull().ToArray();
        }

        return this.locationSearchCache[name]!;
    }

    //Private state
    private countryCache: Dictionary<Country> | undefined;
    private countryCacheLock: Lock;
    private locationSearchCache: Dictionary<Location[]>;
    private lookupLocationCache: Dictionary<Location>;

    //Private methods
    private MapOSM_Location(input: OSM_Location): Location | null
    {
        const type = this.MapOSM_Type(input);
        if(type === null)
            return null;

        return {
            displayName: input.display_name,
            id: "osm:" + input.osm_type + "/" + input.osm_id,
            latitude: input.lat,
            longitude: input.lon,
            type: type,
            internalType: input.category + " - " + input.type,
            twoLetterCountryCode: input.address.country_code
        };
    }

    private MapOSM_Type(input: OSM_Location): "city" | "country" | "region" | "village" | "unknown" | null
    {
        switch(input.category)
        {
            case "amenity":
            {
                switch(input.type)
                {
                    case "social_facility":
                        return null;
                }
            }
            break;
            case "boundary":
            {
                switch(input.type)
                {
                    case "administrative":
                    {
                        if(input.address.hamlet !== undefined)
                            return "village";
                        else if(input.address.village !== undefined)
                            return "village";
                        else if(input.address.town !== undefined)
                            return "city";
                        else if(input.address.city !== undefined)
                            return "city";
                        else if(input.address.county !== undefined)
                            return "region";
                        else if(input.address.state !== undefined)
                            return "region";

                        return "country";
                    }
                }
            }
            break;
            case "building":
            {
                switch(input.type)
                {
                    case "train_station":
                        return null;
                }
            }
            break;
            case "highway":
            {
                switch(input.type)
                {
                    case "unclassified":
                        return null;
                }
            }
            break;
            case "office":
            {
                switch(input.type)
                {
                    case "company":
                        return null;
                }
            }
            break;
            case "place":
            {
                switch(input.type)
                {
                    case "city":
                    case "town":
                        return "city";
                    case "hamlet":
                    case "village":
                        return "village";
                }
            }
            break;
            case "railway":
            {
                switch(input.type)
                {
                    case "station":
                        return null;
                }
            }
            break;
            case "tourism":
            {
                switch(input.type)
                {
                    case "artwork":
                        return null;
                }
            }
            break;
        }

        return "unknown";
    }
}
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

import { Component, Injectable, JSX_CreateElement, ProgressSpinner } from "acfrontend";
import { APIService } from "../APIService";
import { Location } from "../../dist/api";

@Injectable
export class LocationsMap extends Component<{ locationIds: string[]; }>
{
    constructor(private apiService: APIService)
    {
        super();

        this.locations = null;
    }

    protected Render(): RenderValue
    {
        if(this.locations === null)
            return <ProgressSpinner />;

        const points = this.locations.map(x => ({
            lat: parseFloat(x.latitude),
            lon: parseFloat(x.longitude)
        }));
        /*const center = {
            lat: points.Values().Map(x => x.lat).Sum() / points.length,
            lon: points.Values().Map(x => x.lon).Sum() / points.length,
        };*/

        const data = {
            //center,
            points,
        };
        return <iframe src={"leaflet.htm?data=" + encodeURIComponent(JSON.stringify(data))} style="width: 100%; height: 80vh" />;
    }

    //Private state
    private locations: Location[] | null;

    //Private methods
    private async QueryData()
    {
        this.locations = null;
        this.locations = await this.input.locationIds.Values().Map(async id => {
            const response = await this.apiService.locations._any_.get(id);
            return response.data;
        }).PromiseAll();
    }

    //Event handlers
    override OnInitiated(): void
    {
        this.QueryData();
    }

    override OnInputChanged(): void
    {
        this.QueryData();
    }
}
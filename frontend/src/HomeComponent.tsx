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
import { LocationsMap } from "./trips/LocationsMap";
import { CountriesMap } from "./trips/CountriesMap";
import { APIService } from "./APIService";

@Injectable
export class HomeComponent extends Component
{
    constructor(private apiService: APIService)
    {
        super();

        this.locations = null;
    }

    protected Render()
    {
        if(this.locations === null)
            return <ProgressSpinner />;

        return <div className="row">
            <div className="col">
                <LocationsMap locationIds={this.locations} />
            </div>
            <div className="col">
                <CountriesMap locationIds={this.locations} />
            </div>
        </div>;
    }

    //Private state
    private locations: string[] | null;

    //Event handlers
    override async OnInitiated(): Promise<void>
    {
        const response = await this.apiService.user.allLocations.get();
        this.locations = response.data;
    }
}
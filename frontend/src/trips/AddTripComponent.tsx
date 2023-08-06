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

import { Component, Injectable, JSX_CreateElement, ProgressSpinner, Router } from "acfrontend";
import { APIService } from "../APIService";
import { TripEditorComponent } from "./TripEditorComponent";
import { TripCreationData } from "../../dist/api";
import { LocationsMap } from "./LocationsMap";
import { CountriesMap } from "./CountriesMap";

@Injectable
export class AddTripComponent extends Component
{
    constructor(private apiService: APIService, private router: Router)
    {
        super();

        const startDate = new Date().toISOString().split("T")[0];
        this.trip = {
            stops: [
                {
                    startDate,
                    endDate: startDate,
                    locationId: ""
                }
            ]
        };
        this.loading = false;
    }

    protected Render()
    {
        if(this.loading)
            return <ProgressSpinner />;

        const initializedLocations = this.trip.stops.Values().Map(x => x.locationId).Filter(x => x !== "").ToArray();
        const anyNotSet = this.trip.stops.Values().Filter(x => x.locationId === "").Any();
        return <fragment>
            <TripEditorComponent trip={this.trip} onLocationsChanged={this.Update.bind(this)} />
            <br />
            <button type="button" className="btn btn-primary" disabled={anyNotSet} onclick={this.CreateTrip.bind(this)}>Create</button>
            <div className="row">
                <div className="col">
                    <LocationsMap locationIds={initializedLocations} />
                </div>
                <div className="col">
                    <CountriesMap locationIds={initializedLocations} />
                </div>
            </div>
        </fragment>;
    }

    //Private state
    private trip: TripCreationData;
    private loading: boolean;

    //Event handlers
    private async CreateTrip()
    {
        this.loading = true;
        const response = await this.apiService.trips.post(this.trip);
        this.router.RouteTo("/trips/" + response.data);
    }
}
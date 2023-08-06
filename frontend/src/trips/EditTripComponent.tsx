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

import { Component, Injectable, JSX_CreateElement, ProgressSpinner, Router, RouterState } from "acfrontend";
import { APIService } from "../APIService";
import { TripEditorComponent } from "./TripEditorComponent";
import { Trip } from "../../dist/api";
import { LocationsMap } from "./LocationsMap";
import { CountriesMap } from "./CountriesMap";

@Injectable
export class EditTripComponent extends Component
{
    constructor(private apiService: APIService, private router: Router, routerState: RouterState)
    {
        super();

        this.tripId = parseInt(routerState.routeParams.tripId!);
        this.trip = null;
    }

    protected Render()
    {
        if(this.trip === null)
            return <ProgressSpinner />;

        const initializedLocations = this.trip.stops.Values().Map(x => x.locationId).Filter(x => x !== "").ToArray();
        const anyNotSet = this.trip.stops.Values().Filter(x => x.locationId === "").Any();
        return <fragment>
            <TripEditorComponent trip={this.trip} onLocationsChanged={this.Update.bind(this)} />
            <br />
            <button type="button" className="btn btn-primary" disabled={anyNotSet} onclick={this.OnSave.bind(this)}>Save</button>
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
    private tripId: number;
    private trip: Trip | null;

    //Event handlers
    override async OnInitiated(): Promise<void>
    {
        const response = await this.apiService.trips._any_.get(this.tripId);
        this.trip = response.data;
    }

    private async OnSave()
    {
        const trip = this.trip!;
        this.trip = null;
        
        await this.apiService.trips._any_.put(this.tripId, trip);
        this.router.RouteTo("/trips/" + trip.id);
    }
}
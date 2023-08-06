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

import { Anchor, BootstrapIcon, Component, Injectable, JSX_CreateElement, ProgressSpinner, RouterState } from "acfrontend";
import { APIService } from "../APIService";
import { Location, Trip, TripStop } from "../../dist/api";
import { LocationsMap } from "./LocationsMap";
import { CountriesMap } from "./CountriesMap";

@Injectable
export class ShowTripComponent extends Component
{
    constructor(routerState: RouterState, private apiService: APIService)
    {
        super();

        this.tripId = parseInt(routerState.routeParams.tripId!);
        this.trip = null;
        this.stopLocations = [];
    }
    
    protected Render(): RenderValue
    {
        if(this.trip === null)
            return <ProgressSpinner />;

        const locations = this.trip.stops.map(x => x.locationId);
        return <fragment>
            <Anchor route={"/trips/" + this.tripId + "/edit"}><BootstrapIcon>pencil</BootstrapIcon></Anchor>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Start date</th>
                        <th>End date</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {this.trip.stops.map(this.RenderTripStop.bind(this))}
                </tbody>
            </table>
            <div className="row">
                <div className="col">
                    <LocationsMap locationIds={locations} />
                </div>
                <div className="col">
                    <CountriesMap locationIds={locations} />
                </div>
            </div>
        </fragment>;
    }

    //Private state
    private tripId: number;
    private trip: Trip | null;
    private stopLocations: Location[];

    //Private methods
    private RenderTripStop(stop: TripStop, index: number)
    {
        return <tr>
            <td>{stop.startDate}</td>
            <td>{stop.endDate}</td>
            <td>{this.stopLocations[index].displayName}</td>
        </tr>;
    }

    //Event handlers
    override async OnInitiated(): Promise<void>
    {
        const response = await this.apiService.trips._any_.get(this.tripId);
        if(response.statusCode !== 200)
            throw new Error("impleement me");

        this.stopLocations = await response.data.stops.Values().Map(async x => {
            const response = await this.apiService.locations._any_.get(x.locationId);
            return response.data;
        }).PromiseAll();

        this.trip = response.data;
    }
}
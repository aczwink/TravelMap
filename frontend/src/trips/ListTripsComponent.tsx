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

import { Anchor, BootstrapIcon, Component, Injectable, JSX_CreateElement, ProgressSpinner, RouterButton } from "acfrontend";
import { APIService } from "../APIService";
import { TripOverviewDataDTO } from "../../dist/api";

@Injectable
export class ListTripsComponent extends Component
{
    constructor(private apiService: APIService)
    {
        super();

        this.trips = null;
    }

    protected Render()
    {
        if(this.trips === null)
            return <ProgressSpinner />;

        return <fragment>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Your trip to:</th>
                        <th>Start date</th>
                        <th>End date</th>
                    </tr>
                </thead>
                <tbody>
                    {this.trips.map(this.RenderTrip.bind(this))}
                </tbody>
            </table>
            <RouterButton className="btn btn-primary" route="/trips/add"><BootstrapIcon>plus</BootstrapIcon></RouterButton>
        </fragment>;
    }

    //Private state
    private trips: TripOverviewDataDTO[] | null;

    //Private methods
    private RenderTrip(trip: TripOverviewDataDTO)
    {
        return <tr>
            <td><Anchor route={"/trips/" + trip.id}>{trip.title}</Anchor></td>
            <td>{trip.startDate}</td>
            <td>{trip.endDate}</td>
        </tr>;
    }

    //Event handlers
    override async OnInitiated(): Promise<void>
    {
        const response = await this.apiService.trips.get();
        this.trips = response.data;
    }
}
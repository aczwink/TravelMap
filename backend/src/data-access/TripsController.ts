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

import { DBQueryExecutor, Injectable } from "acts-util-node";
import { DatabaseController } from "./DatabaseController";

interface TripStop
{
    startDate: string;
    endDate: string;
    locationId: string;
}

export interface TripCreationData
{
    stops: TripStop[];
}

export interface Trip extends TripCreationData
{
    id: number;
}

export interface TripOverviewData
{
    id: number;
    startDate: string;
    endDate: string;
}

@Injectable
export class TripsController
{
    constructor(private dbController: DatabaseController)
    {
    }

    //Public methods
    public async AddTrip(trip: TripCreationData)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();

        const result = await conn.InsertRow("trips", {});
        await this.InsertStops(conn, result.insertId, trip.stops);

        return result.insertId;
    }

    public async QueryTrip(tripId: number)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();

        const stops = await conn.Select<TripStop>("SELECT startDate, endDate, locationId FROM trips_stops WHERE tripId = ?", tripId);

        const trip: Trip = {
            id: tripId,
            stops
        };
        return trip;
    }

    public async QueryTrips()
    {
        const query = `
        SELECT ts.tripId AS id, MIN(ts.startDate) AS startDate, MAX(ts.endDate) AS endDate
        FROM trips_stops ts
        GROUP BY ts.tripId
        ORDER BY ts.startDate DESC
        `;
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();

        const rows = await conn.Select<TripOverviewData>(query);

        return rows;
    }

    public async UpdateTrip(tripId: number, trip: TripCreationData)
    {
        const conn = await this.dbController.CreateAnyConnectionQueryExecutor();

        await conn.DeleteRows("trips_stops", "tripId = ?", tripId);
        await this.InsertStops(conn, tripId, trip.stops);
    }

    //Private methods
    private async InsertStops(conn: DBQueryExecutor, tripId: number, stops: TripStop[])
    {
        for (const stop of stops)
        {
            await conn.InsertRow("trips_stops", {
                tripId: tripId,
                startDate: stop.startDate,
                endDate: stop.endDate,
                locationId: stop.locationId
            });
        }
    }
}
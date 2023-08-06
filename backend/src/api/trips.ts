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
import { APIController, Body, Get, Path, Post, Put } from "acts-util-apilib";
import { TripCreationData, TripsController } from "../data-access/TripsController";
import { TripsMetaDataCacheService } from "../geocoding/TripsMetaDataCacheService";

@APIController("trips")
class _api_
{
    constructor(private tripsController: TripsController, private tripsMetaDataCacheService: TripsMetaDataCacheService)
    {
    }

    @Post()
    public async AddTrip(
        @Body data: TripCreationData
    )
    {
        return await this.tripsController.AddTrip(data);
    }

    @Get()
    public async QueryTrips()
    {
        const trips = await this.tripsController.QueryTrips();
        return trips.Values().Map(this.tripsMetaDataCacheService.AugmentTripOverviewData.bind(this.tripsMetaDataCacheService)).PromiseAll();
    }

    @Get("{tripId}")
    public async QueryTrip(
        @Path tripId: number
    )
    {
        return await this.tripsController.QueryTrip(tripId);
    }

    @Put("{tripId}")
    public async UpdateTrip(
        @Path tripId: number,
        @Body trip: TripCreationData
    )
    {
        this.tripsMetaDataCacheService.ClearCache(tripId);
        return await this.tripsController.UpdateTrip(tripId, trip);
    }
}
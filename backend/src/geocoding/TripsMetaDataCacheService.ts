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

import { Injectable } from "acts-util-node";
import { TripOverviewData, TripsController } from "../data-access/TripsController";
import { NumberDictionary } from "acts-util-core";
import { GeocodingService } from "./GeocodingService";

interface TripOverviewDataDTO extends TripOverviewData
{
    title: string;
}

interface TripCacheData
{
    title: string;
}

@Injectable
export class TripsMetaDataCacheService
{
    constructor(private tripsController: TripsController, private geocodingService: GeocodingService)
    {
        this.cache = {};
    }

    //Public methods
    public async AugmentTripOverviewData(input: TripOverviewData): Promise<TripOverviewDataDTO>
    {
        if(!(input.id in this.cache))
            await this.CacheTripData(input.id);

        const data = this.cache[input.id]!;
        return {
            title: data.title,
            ...input
        };
    }

    public ClearCache(tripId: number)
    {
        delete this.cache[tripId];
    }

    //Private state
    private cache: NumberDictionary<TripCacheData>;

    //Private methods
    private async CacheTripData(tripId: number)
    {
        const trip = await this.tripsController.QueryTrip(tripId);
        const locations = await trip.stops.Values().Map(x => this.geocodingService.ResolveLocation(x.locationId)).PromiseAll();

        if(locations.length === 1)
        {
            this.cache[tripId] = {
                title: locations[0].displayName
            };
        }
        else
        {
            const countries = await locations.Values().Map(x => this.geocodingService.ResolveCountry(x.twoLetterCountryCode)).PromiseAll();
            const groupedAndOrderedCountries = countries.Values().Distinct(x => x.name).OrderBy(x => x.name);
            
            this.cache[tripId] = {
                title: groupedAndOrderedCountries.Map(x => x.name).Join(", ")
            };
        }
    }
}
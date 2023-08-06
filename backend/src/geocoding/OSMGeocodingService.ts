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

import { Injectable, HTTP, Lock } from "acts-util-node";

interface OSM_Address
{
    //ordered from smallest to largest
    hamlet?: string;
    village?: string;
    town?: string;
    city?: string;
    county?: string;
    state?: string;
    country: string;
    country_code: string;
}

export interface OSM_Location
{
    osm_type: "relation";
    osm_id: number;
    lat: string;
    lon: string;
    display_name: string;
    category: string;
    type: string;
    address: OSM_Address;
}

@Injectable
export class OSMGeocodingService
{
    constructor()
    {
        this.lastCall = 0;
        this.lastCallLock = new Lock;
    }

    //Public methods
    public FreeSearch(name: string)
    {
        return this.CallOSM("q", name);
    }

    public async ResolveLocation(osm_type: "relation", osm_id: number)
    {
        await this.RateLimit();

        const apiService = new HTTP.APIServiceBase("nominatim.openstreetmap.org", 443, "https");
        const response = await apiService.SendRequest({
            formatRules: [],
            method: "GET",
            path: "/lookup",
            responseType: "json",
            successStatusCode: 200,
            query: {
                "accept-language": "en",
                format: "jsonv2",
                "osm_ids": "R" + osm_id
            }
        }, {
            Host: "nominatim.openstreetmap.org",
            "User-Agent": "TravelMap-Backend-Service"
        });
        if(response.statusCode !== 200)
            throw new Error("OSM resolve error: " + response.statusCode);

        const result = response.body as OSM_Location[];
        return result[0];
    }

    //Private state
    private lastCall: number;
    private lastCallLock: Lock;

    //Private methods
    private async CallOSM(searchType: "city" | "q" | "state", name: string)
    {
        await this.RateLimit();

        const apiService = new HTTP.APIServiceBase("nominatim.openstreetmap.org", 443, "https");
        const response = await apiService.SendRequest({
            formatRules: [],
            method: "GET",
            path: "/search",
            responseType: "json",
            successStatusCode: 200,
            query: {
                "accept-language": "en",
                addressdetails: 1,
                format: "jsonv2",
                [searchType]: name
            }
        }, {
            Host: "nominatim.openstreetmap.org",
            "User-Agent": "TravelMap-Backend-Service"
        });
        if(response.statusCode !== 200)
            throw new Error("OSM error: " + response.statusCode);

        return response.body as OSM_Location[];
    }

    private async RateLimit()
    {
        const lock = await this.lastCallLock.Lock();

        const now = Date.now();
        const diff = now - this.lastCall;
        
        if(diff <= 1000)
        {
            await new Promise( resolve => setTimeout(resolve, 1000 - diff) );
        }

        this.lastCall = now;
        lock.Release();
    }
}

/*
*/
/*
    //for finding countries from lat,lon: https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=51&lon=0&zoom=3
*/
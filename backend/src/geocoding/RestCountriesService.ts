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

import { HTTP, Injectable } from "acts-util-node";

export interface Country
{
    name: string;
    cca2: string;
    latitude: number;
    longitude: number;
    osm_type: string;
    osm_id: number;
}

@Injectable
export class RestCountriesService
{
    //Public methods
    public async FetchCountries(): Promise<Country[]>
    {
        const apiService = new HTTP.APIServiceBase("restcountries.com", 443, "https");
        const response = await apiService.SendRequest({
            formatRules: [],
            method: "GET",
            path: "/v3.1/all",
            responseType: "json",
            successStatusCode: 200,
            query: {
                "fields": "cca2,name,latlng,maps",
            }
        }, {
            //Host: "restcountries.com",
            //"User-Agent": "TravelMap-Backend-Service"
        });

        return (response.body as any[]).map(x => {
            const parts = x.maps.openStreetMaps.split("/");
            const res: Country = {
                cca2: x.cca2,
                latitude: x.latlng[0],
                longitude: x.latlng[1],
                name: x.name.common,
                osm_type: parts[parts.length - 2],
                osm_id: parseInt(parts[parts.length - 1]),
            };
            return res;
        });
    }
}
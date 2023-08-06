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
import { APIController, Get } from "acts-util-apilib";
import { UserController } from "../data-access/UserController";
import { GeocodingService } from "../geocoding/GeocodingService";

@APIController("user")
class _api_
{
    constructor(private userController: UserController, private geocodingService: GeocodingService)
    {
    }

    @Get("allLocations")
    public async QueryAllVisitedLocations()
    {
        return this.userController.QueryAllVisitedLocations();
    }
}
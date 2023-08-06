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

import { Routes } from "acfrontend";
import { AddTripComponent } from "./trips/AddTripComponent";
import { ListTripsComponent } from "./trips/ListTripsComponent";
import { ShowTripComponent } from "./trips/ShowTripComponent";
import { EditTripComponent } from "./trips/EditTripComponent";
import { HomeComponent } from "./HomeComponent";

export const routes : Routes = [
    { path: "trips/add", component: AddTripComponent },
    { path: "trips/:tripId/edit", component: EditTripComponent },
    { path: "trips/:tripId", component: ShowTripComponent },
    { path: "trips", component: ListTripsComponent },
    { path: "", component: HomeComponent }
];
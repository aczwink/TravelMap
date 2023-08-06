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

import { BootstrapIcon, Component, DatePicker, FormField, JSX_CreateElement } from "acfrontend";
import { TripCreationData, TripStop } from "../../dist/api";
import { LocationSelector } from "../geo/LocationSelector";

export class TripEditorComponent extends Component<{ trip: TripCreationData; onLocationsChanged: () => void }>
{
    protected Render()
    {
        return <fragment>
            {...this.input.trip.stops.map(this.RenderTripStop.bind(this))}
            <button type="button" className="btn btn-primary" onclick={this.OnCreateStop.bind(this)}><BootstrapIcon>plus</BootstrapIcon></button>
        </fragment>;
    }

    //Private methods
    private RenderTripStop(tripStop: TripStop, index: number)
    {
        return <div className="row">
            <div className="col-auto">
                <FormField title="Start date">
                    <DatePicker value={tripStop.startDate} onChanged={this.OnStartDateChanged.bind(this, tripStop)} />
                </FormField>
            </div>
            <div className="col-auto">
                <FormField title="End date">
                    <DatePicker min={tripStop.startDate} value={tripStop.endDate} onChanged={this.OnEndDateChanged.bind(this, tripStop)} />
                </FormField>
            </div>
            <div className="col">
                <LocationSelector locationId={tripStop.locationId === "" ? null : tripStop.locationId} onValueChanged={this.OnLocationChanged.bind(this, tripStop)} />
            </div>
            <div className="col-auto" style="margin:auto;">
                <a href="#" className="link-danger" onclick={this.OnDeleteStop.bind(this, index)}><BootstrapIcon>trash</BootstrapIcon></a>
            </div>
        </div>;
    }

    //Event handlers
    private OnCreateStop()
    {
        const startDate = (this.input.trip.stops.length > 0) ? (this.input.trip.stops[this.input.trip.stops.length - 1].endDate) : (new Date().toISOString().split("T")[0]);

        this.input.trip.stops.push({
            startDate,
            endDate: startDate,
            locationId: ""
        });
        this.Update();
    }

    private OnDeleteStop(index: number, event: Event)
    {
        event.preventDefault();
        
        this.input.trip.stops.Remove(index);
        this.input.onLocationsChanged();
    }

    private OnEndDateChanged(tripStop: TripStop, newValue: string)
    {
        tripStop.endDate = newValue;
        this.Update();
    }

    private OnLocationChanged(tripStop: TripStop, newValue: string)
    {
        tripStop.locationId = newValue;
        this.input.onLocationsChanged();
    }

    private OnStartDateChanged(tripStop: TripStop, newValue: string)
    {
        tripStop.startDate = newValue;
        this.Update();
    }
}
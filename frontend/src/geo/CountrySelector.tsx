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
/*
import { AutoCompleteSelectBox, Component, FormField, Injectable, JSX_CreateElement, KeyDisplayValuePair } from "acfrontend";
import { CachedGeocodingService } from "./CachedGeocodingService";

@Injectable
export class CountrySelector extends Component
{
    constructor(private geocodingService: CachedGeocodingService)
    {
        super();

        this.currentValue = null;
    }

    protected Render()
    {
        return <FormField title="Country">
            <AutoCompleteSelectBox<number> onChanged={newValue => this.currentValue = newValue} selection={this.currentValue} onLoadSuggestions={this.LoadCountries.bind(this)} />
        </FormField>;
    }

    //Private state
    private currentValue: KeyDisplayValuePair<number> | null;

    //Private methods
    private async LoadCountries(filterText: string): Promise<KeyDisplayValuePair<number>[]>
    {
        const countries = await this.geocodingService.FindCountries(filterText);
        return countries.map(x => ({
            key: x.osm_id,
            displayValue: x.name
        }));
    }
}*/
import { Injectable } from '@angular/core';
const cities = require('../../assets/kladr.json');

import {Observable} from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/delay';

interface CityServer {
    Id: number,
    City: string
}

@Injectable()
export class FormApiService {
    private _countRequestWithError = 0;
    constructor() {}

    getCities(): CityServer[] {
        return cities;
    }

    searchCities(searchString: string = '', delay: number = 100): Observable<CityServer[]> {
        const searchData = searchString.toLowerCase();
        const filteredData = cities.filter(item => item.Id == searchData || item.City.toLowerCase().indexOf(searchData) > -1);
        return Observable.of(filteredData).delay(delay);
    }

    searchShortCities(searchString: string = ''): Observable<CityServer[]> {
        const searchData = searchString.toLowerCase();
        const shortCities = cities.slice(0, 40);

        const filteredData = shortCities.filter(item => item.Id == searchData || item.City.toLowerCase().indexOf(searchData) > -1);
        return Observable.of(filteredData).delay(10);
    }

    searchCitiesWithError(searchString: string = ''): Observable<CityServer[]> {
        const searchData = searchString.toLowerCase();
        this._countRequestWithError++;

        if (this._countRequestWithError % 2 === 0) {
            return Observable.throw({}).delay(200);
        }

        const filteredData = cities.filter(item => item.Id == searchData || item.City.toLowerCase().indexOf(searchData) > -1);
        return Observable.of(filteredData).delay(200);
    }
}

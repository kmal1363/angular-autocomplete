import {Component, EventEmitter} from '@angular/core';

import {FormApiService} from './form-api';
import {AutocompleteOption} from '../../autocomplete/models/option';

import 'rxjs/add/operator/debounceTime';

@Component({
    selector: 'form-test',
    templateUrl: './form.component.html'
})
export class FormComponent {
    public server = {
        time300: null,
        time800: null,
        items40: null,
        withError: null,
    };

    public options = {
        staticItems: [],
    };

    constructor(
        private api: FormApiService,
    ) {

        this.options.staticItems = this.getOptionsForComponentSearch();

        this.server.time300 = (searchString: string) => this.searchCities(searchString, 300);
        this.server.time800 = (searchString: string) => this.searchCities(searchString, 800);

        this.server.items40 = (searchString: string) => this.searchShortCities(searchString);

        this.server.withError = (searchString: string) => this.searchWithError(searchString);
    }

    getOptionsForComponentSearch() {
        const citiesFromServer = this.api.getCities();
        return this.parseCity(citiesFromServer);
    }

    searchShortCities(searchString: string) {
        return this.api.searchShortCities(searchString)
            .map(dataFromServer => {
                return this.parseCity(dataFromServer);
            });
    }

    searchWithError(searchString: string) {
        return this.api.searchCitiesWithError(searchString)
            .map(dataFromServer => {
                return this.parseCity(dataFromServer);
            });
    }

    searchCities(searchString, delay) {
        return this.api.searchCities(searchString, delay)
            .map(dataFromServer => {
                return this.parseCity(dataFromServer);
            });
    }

    parseCity(citiesFromServer) {
        return citiesFromServer.map(item => ({id: item.Id, value: item.City}));
    }
}

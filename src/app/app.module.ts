import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, PreloadAllModules, Routes} from '@angular/router';
import {HttpModule} from '@angular/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule}   from '@angular/forms';

import {AppComponent} from './app.component';
import {AutocompleteModule} from '../autocomplete';
import {FormComponent} from './form';

import {FormApiService} from './form';

const routes: Routes = [];

@NgModule({
    declarations: [
        AppComponent,
        FormComponent,
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes, {
            useHash: Boolean(history.pushState) === false,
            preloadingStrategy: PreloadAllModules
        }),
        NgbModule.forRoot(),
        HttpModule,
        FormsModule,
        AutocompleteModule,
    ],
    exports: [],
    providers: [
        FormApiService
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}

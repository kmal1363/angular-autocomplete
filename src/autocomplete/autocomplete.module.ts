import {NgModule} from '@angular/core';
import {FormsModule}   from '@angular/forms';
import {CommonModule} from '@angular/common';

// Components
import {AutocompleteComponent} from './autocomplete';
import {AutocompleteListComponent} from './autocomplete-list';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        AutocompleteComponent,
        AutocompleteListComponent,
    ],
    providers: [],
    exports: [
        AutocompleteComponent
    ],
})
export class AutocompleteModule { }

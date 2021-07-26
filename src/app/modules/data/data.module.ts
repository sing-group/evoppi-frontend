/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2019 - Noé Vázquez González,
 *  Miguel Reboiro-Jato, Jorge Vieira, Hugo López-Fernández,
 *  and Cristina Vieira.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatabaseInteractomeListComponent} from './database-interactome-list/database-interactome-list.component';
import {SpeciesListComponent} from './species-list/species-list.component';
import {AutocompleteComponent} from './autocomplete/autocomplete.component';
import {MaterialDesignModule} from '../material-design/material-design.module';
import {SharedModule} from '../shared/shared.module';
import {DatabaseInteractomeCreationComponent} from './database-interactome-creation/database-interactome-creation.component';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialFileInputModule} from 'ngx-material-file-input';
import {SpeciesCreationComponent} from './species-creation/species-creation.component';
import {DatabaseInteractomeService} from './services/database-interactome.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        MaterialDesignModule,
        MaterialFileInputModule,
        ReactiveFormsModule,
        RouterModule,
        SharedModule
    ],
    declarations: [
        DatabaseInteractomeListComponent,
        SpeciesListComponent,
        AutocompleteComponent,
        DatabaseInteractomeCreationComponent,
        SpeciesCreationComponent
    ],
    exports: [
        DatabaseInteractomeListComponent,
        SpeciesListComponent,
        AutocompleteComponent
    ],
    providers: [
        DatabaseInteractomeService
    ]
})
export class DataModule {
}

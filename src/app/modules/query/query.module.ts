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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {QueryComponent} from './query.component';
import {FormDistinctSpeciesComponent} from './form-distinct-species/form-distinct-species.component';
import {FormSameSpeciesComponent} from './form-same-species/form-same-species.component';
import {MaterialDesignModule} from '../material-design/material-design.module';
import {DataModule} from '../data/data.module';
import {SpeciesService} from '../results/services/species.service';
import {InteractomeService} from '../results/services/interactome.service';
import {InteractionService} from '../results/services/interaction.service';
import {GeneService} from '../results/services/gene.service';
import { InteractomeSelectionFormComponent } from './interactome-selection-form/interactome-selection-form.component';
import { InteractomeSelectionDialogComponent } from './interactome-selection-dialog/interactome-selection-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialDesignModule,
        DataModule
    ],
    declarations: [
        QueryComponent,
        FormDistinctSpeciesComponent,
        FormSameSpeciesComponent,
        InteractomeSelectionFormComponent,
        InteractomeSelectionDialogComponent
    ],
    exports: [
        QueryComponent,
        FormDistinctSpeciesComponent,
        FormSameSpeciesComponent
    ],
    providers: [
        SpeciesService,
        InteractomeService,
        InteractionService,
        GeneService
    ]
})
export class QueryModule {
}

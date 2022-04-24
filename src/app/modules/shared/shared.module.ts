/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2022 - Noé Vázquez González,
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
import {MaterialDesignModule} from '../material-design/material-design.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableInputComponent} from './components/table-input/table-input.component';
import {CanDeactivateComponentGuardService} from './components/can-deactivate/can-deactivate-component-guard-service';
import { JoinPipe } from './pipes/join.pipe';
import {InteractomeSelectionFormComponent} from './components/interactome-selection-form/interactome-selection-form.component';
import {InteractomeSelectionDialogComponent} from './components/interactome-selection-dialog/interactome-selection-dialog.component';


@NgModule({
    declarations: [
        TableInputComponent,
        JoinPipe,
        InteractomeSelectionFormComponent,
        InteractomeSelectionDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialDesignModule
    ],
    exports: [
        TableInputComponent,
        JoinPipe,
        InteractomeSelectionFormComponent,
        InteractomeSelectionDialogComponent
    ],
    providers: [
        CanDeactivateComponentGuardService
    ]
})
export class SharedModule {
}

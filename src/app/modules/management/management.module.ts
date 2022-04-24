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
import {UserManagementComponent} from './user-management/user-management.component';
import {SpeciesManagementComponent} from './species-management/species-management.component';
import {InteractomeManagementComponent} from './interactome-management/interactome-management.component';
import {MatButtonModule} from '@angular/material/button';
import {WorksManagementComponent} from './works-management/works-management.component';
import {MaterialDesignModule} from '../material-design/material-design.module';
import {HttpClientModule} from '@angular/common/http';
import {ResultsModule} from '../results/results.module';
import {SharedModule} from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        MatButtonModule,
        MaterialDesignModule,
        ResultsModule,
        SharedModule
    ],
    declarations: [
        InteractomeManagementComponent,
        SpeciesManagementComponent,
        UserManagementComponent,
        WorksManagementComponent
    ],
    exports: [
        InteractomeManagementComponent,
        SpeciesManagementComponent,
        UserManagementComponent
    ]
})
export class ManagementModule {
}

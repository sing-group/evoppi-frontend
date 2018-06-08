/*
 *  EvoPPI Frontend
 *
 * Copyright (C) 2017-2018 - Noé Vázquez, Miguel Reboiro-Jato,
 * Jorge Vieria, Sara Rocha, Hugo López-Fernández, André Torres,
 * Rui Camacho, Florentino Fdez-Riverola, and Cristina P. Vieira.
 * .
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {AdminLayoutRoutes} from './admin-layout.routing';

import {DashboardComponent} from '../../dashboard/dashboard.component';
import {QueryComponent} from '../../query/query.component';
import {FormDistinctSpeciesComponent} from '../../query/form-distinct-species/form-distinct-species.component';
import {FormSameSpeciesComponent} from '../../query/form-same-species/form-same-species.component';
import {ResultsComponent} from '../../results/results.component';
import {TableDistinctSpeciesComponent} from '../../results/table-distinct-species/table-distinct-species.component';
import {TableSameSpeciesComponent} from '../../results/table-same-species/table-same-species.component';

import {
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatRippleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSliderModule,
    MatTabsModule,
    MatTooltipModule
} from '@angular/material';
import {ChartDistinctSpeciesComponent} from '../../results/chart-distinct-species/chart-distinct-species.component';
import {ChartSameSpeciesComponent} from '../../results/chart-same-species/chart-same-species.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSelectModule,
        MatSnackBarModule,
        MatSliderModule,
        MatTabsModule,
        MatTooltipModule
    ],
    declarations: [
        DashboardComponent,
        QueryComponent,
        FormDistinctSpeciesComponent,
        FormSameSpeciesComponent,
        ResultsComponent,
        ChartDistinctSpeciesComponent,
        ChartSameSpeciesComponent,
        TableDistinctSpeciesComponent,
        TableSameSpeciesComponent
    ]
})
export class AdminLayoutModule {
}

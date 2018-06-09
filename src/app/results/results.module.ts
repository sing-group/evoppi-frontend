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
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule
} from '@angular/material';

import {ResultsComponent} from './results.component';
import {ChartDistinctSpeciesComponent} from './chart-distinct-species/chart-distinct-species.component';
import {ChartSameSpeciesComponent} from './chart-same-species/chart-same-species.component';
import {TableDistinctSpeciesComponent} from './table-distinct-species/table-distinct-species.component';
import {TableSameSpeciesComponent} from './table-same-species/table-same-species.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatProgressBarModule,
        MatTooltipModule
    ],
    declarations: [
        ResultsComponent,
        ChartDistinctSpeciesComponent,
        ChartSameSpeciesComponent,
        TableDistinctSpeciesComponent,
        TableSameSpeciesComponent
    ],
    exports: [
        ResultsComponent,
        ChartDistinctSpeciesComponent,
        ChartSameSpeciesComponent,
        TableDistinctSpeciesComponent,
        TableSameSpeciesComponent
    ]
})
export class ResultsModule {
}

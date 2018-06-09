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

import {Routes} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {QueryComponent} from '../../query/query.component';
import {ResultsComponent} from '../../results/results.component';
import {TableDistinctSpeciesComponent} from '../../results/table-distinct-species/table-distinct-species.component';
import {TableSameSpeciesComponent} from '../../results/table-same-species/table-same-species.component';
import {ChartSameSpeciesComponent} from '../../results/chart-same-species/chart-same-species.component';
import {ChartDistinctSpeciesComponent} from '../../results/chart-distinct-species/chart-distinct-species.component';

export const ADMIN_LAYOUT_ROUTES: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'query', component: QueryComponent, data: {resultsResource: 'results'}},
    {
        path: 'results',
        component: ResultsComponent,
        data: {
            state: 'results-list',
            chartDistinctSpeciesPath: '/results/chart/distinct/{0}',
            chartSameSpeciesPath: '/results/chart/same/{0}',
            tableDistinctSpeciesPath: '/results/table/distinct/{0}',
            tableSameSpeciesPath: '/results/table/same/{0}'
        }
    },
    {
        path: 'results/chart/distinct/:id',
        component: ChartDistinctSpeciesComponent,
        data: {state: 'results-detail', resultsResource: 'results'}
    },
    {
        path: 'results/chart/same/:id',
        component: ChartSameSpeciesComponent,
        data: {state: 'results-detail', resultsResource: 'results'}
    },
    {
        path: 'results/table/distinct/:id',
        component: TableDistinctSpeciesComponent,
        data: {state: 'results-detail', resultsResource: 'results'}
    },
    {
        path: 'results/table/same/:id',
        component: TableSameSpeciesComponent,
        data: {state: 'results-detail', resultsResource: 'results'}
    }
];







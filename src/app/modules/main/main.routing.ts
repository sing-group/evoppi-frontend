/*
 *  EvoPPI Frontend
 *
 * Copyright (C) 2017-2018 - Noé Vázquez, Miguel Reboiro-Jato,
 * Jorge Vieria, Sara Rocha, Hugo López-Fernández, André Torres,
 * Rui Camacho, Florentino Fdez-Riverola, and Cristina P. Vieira.
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
import {QueryComponent} from '../query/query.component';
import {ResultsComponent} from '../results/results.component';
import {TableDistinctSpeciesComponent} from '../results/table-distinct-species/table-distinct-species.component';
import {TableSameSpeciesComponent} from '../results/table-same-species/table-same-species.component';
import {ChartSameSpeciesComponent} from '../results/chart-same-species/chart-same-species.component';
import {ChartDistinctSpeciesComponent} from '../results/chart-distinct-species/chart-distinct-species.component';
import {AdminGuard} from './security/admin.guard';
import {UserManagementComponent} from '../management/user-management/user-management.component';
import {SpeciesManagementComponent} from '../management/species-management/species-management.component';
import {InteractomeManagementComponent} from '../management/interactome-management/interactome-management.component';
import {SpeciesListComponent} from '../data/species-list/species-list.component';
import {ResearcherGuard} from './security/researcher.guard';
import {InteractomeListComponent} from '../data/interactome-list/interactome-list.component';
import {LoginComponent} from '../authentication/login/login.component';
import {RegistrationComponent} from '../authentication/registration/registration.component';
import {RecoveryComponent} from '../authentication/recovery/recovery.component';

export const MAIN_ROUTES: Routes = [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
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
    },
    {
        path: 'species',
        component: SpeciesListComponent,
        canActivate: [ResearcherGuard]
    },
    {
        path: 'interactomes',
        component: InteractomeListComponent,
        canActivate: [ResearcherGuard]
    },
    {
        path: 'management',
        canActivateChild: [AdminGuard],
        children: [
            {
                path: 'users',
                component: UserManagementComponent
            },
            {
                path: 'species',
                component: SpeciesManagementComponent
            },
            {
                path: 'interactomes',
                component: InteractomeManagementComponent
            }
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
        data: {state: 'login'}
    },
    {
        path: 'logout',
        component: LoginComponent,
        canActivateChild: [AdminGuard],
        data: {state: 'logout'}
    },
    {
        path: 'registration',
        component: RegistrationComponent,
        data: {state: 'registration'}
    },
    {
        path: 'registration/confirmation',
        component: LoginComponent,
        data: {
            state: 'confirmation'
        }
    },
    {
        path: 'recovery',
        component: RecoveryComponent,
        data: {state: 'recovery'}
    },
    {
        path: 'password/recovery',
        component: RecoveryComponent,
        data: {
            state: 'recoveryConfirmation'
        }
    }
];

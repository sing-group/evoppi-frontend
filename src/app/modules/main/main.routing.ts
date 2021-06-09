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
import {InteractomeListComponent} from '../data/interactome-list/interactome-list.component';
import {LoginComponent} from '../authentication/login/login.component';
import {RegistrationComponent} from '../authentication/registration/registration.component';
import {RecoveryComponent} from '../authentication/recovery/recovery.component';
import {WorksManagementComponent} from '../management/works-management/works-management.component';
import {InteractomeCreationComponent} from '../data/interactome-creation/interactome-creation.component';
import {SpeciesCreationComponent} from '../data/species-creation/species-creation.component';
import {CanDeactivateComponentGuardService} from '../shared/components/can-deactivate/can-deactivate-component-guard-service';
import {HelpComponent} from './help/help.component';

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
        canDeactivate: [CanDeactivateComponentGuardService]
    },
    {
        path: 'interactomes',
        component: InteractomeListComponent,
        canDeactivate: [CanDeactivateComponentGuardService]
    },
    {
        path: 'interactomes/creation',
        canActivate: [AdminGuard],
        component: InteractomeCreationComponent,
        data: {
            redirectRoute: '/management/works',
            redirectRouteTitle: 'Go to works'
        }
    },
    {
        path: 'species/creation',
        canActivate: [AdminGuard],
        component: SpeciesCreationComponent,
        data: {
            redirectRoute: '/management/works',
            redirectRouteTitle: 'Go to works'
        }
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
            },
            {
                path: 'works',
                component: WorksManagementComponent
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
    },
    {
        path: 'help',
        component: HelpComponent
    }
];

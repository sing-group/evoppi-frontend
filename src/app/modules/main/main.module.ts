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
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

import {MAIN_ROUTES} from './main.routing';

import {DashboardComponent} from './dashboard/dashboard.component';

import {ResultsModule} from '../results/results.module';
import {QueryModule} from '../query/query.module';
import {AuthenticationModule} from '../authentication/authentication.module';
import {ManagementModule} from '../management/management.module';
import {AdminGuard} from './security/admin.guard';
import {DataModule} from '../data/data.module';
import {NavigationModule} from '../navigation/navigation.module';
import {MainComponent} from './main.component';
import {ResearcherGuard} from './security/researcher.guard';
import {StatsService} from './services/stats.service';

@NgModule({
    imports: [
        AuthenticationModule,
        CommonModule,
        DataModule,
        ManagementModule,
        NavigationModule,
        QueryModule,
        ResultsModule,
        RouterModule.forChild(MAIN_ROUTES)
    ],
    providers: [
        AdminGuard,
        ResearcherGuard,
        StatsService
    ],
    declarations: [
        DashboardComponent,
        MainComponent
    ],
    exports: [
        MainComponent
    ]
})
export class MainModule {
}

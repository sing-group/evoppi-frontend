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
import {RouterModule} from '@angular/router';
import {ResultsComponent} from './results.component';
import {ChartDistinctSpeciesComponent} from './chart-distinct-species/chart-distinct-species.component';
import {ChartSameSpeciesComponent} from './chart-same-species/chart-same-species.component';
import {TableDistinctSpeciesComponent} from './table-distinct-species/table-distinct-species.component';
import {TableSameSpeciesComponent} from './table-same-species/table-same-species.component';
import {DistinctResultsService} from './services/distinct-results.service';
import {SameResultsService} from './services/same-results.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MaterialDesignModule} from '../material-design/material-design.module';
import {AuthenticationInterceptor} from '../authentication/services/authentication.interceptor';
import {LegendTableComponent} from './legend-table/legend-table.component';
import {GeneInfoComponent} from './gene-info/gene-info.component';
import {BlastResultComponent} from './blast-result/blast-result.component';
import {AfterViewInitDirective} from './directives/after-view-init.directive';
import {OnInitDirective} from './directives/on-init.directive';
import {LegendSameSpeciesComponent} from './legend-same-species/legend-same-species.component';
import {GraphComponent} from './graph/graph.component';
import {DraggableDirective} from './directives/draggable.directive';
import {ZoomableDirective} from './directives/zoomable.directive';
import {D3Service} from './services/d3.service';
import {LegendDistinctSpeciesComponent} from './legend-distinct-species/legend-distinct-species.component';
import {WorkStatusService} from './services/work-status.service';
import {SharedModule} from '../shared/shared.module';
import { BlastParamsDialogComponent } from './blast-params-dialog/blast-params-dialog.component';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        MaterialDesignModule,
        RouterModule,
        SharedModule
    ],
    declarations: [
        AfterViewInitDirective,
        BlastResultComponent,
        ChartDistinctSpeciesComponent,
        ChartSameSpeciesComponent,
        DraggableDirective,
        GeneInfoComponent,
        GraphComponent,
        LegendDistinctSpeciesComponent,
        LegendSameSpeciesComponent,
        LegendTableComponent,
        OnInitDirective,
        ResultsComponent,
        TableDistinctSpeciesComponent,
        TableSameSpeciesComponent,
        ZoomableDirective,
        BlastParamsDialogComponent
    ],
    providers: [
        DistinctResultsService,
        SameResultsService,
        WorkStatusService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthenticationInterceptor,
            multi: true
        },
        D3Service
    ],
    exports: [
        ResultsComponent,
        ChartDistinctSpeciesComponent,
        ChartSameSpeciesComponent,
        TableDistinctSpeciesComponent,
        TableSameSpeciesComponent,
        LegendTableComponent,
        GeneInfoComponent,
        BlastResultComponent,
        LegendSameSpeciesComponent,
        LegendDistinctSpeciesComponent,
        GraphComponent,
        AfterViewInitDirective,
        OnInitDirective,
        DraggableDirective,
        ZoomableDirective
    ]
})
export class ResultsModule {
}

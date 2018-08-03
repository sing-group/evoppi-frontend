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

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ChartSameSpeciesComponent} from './chart-same-species.component';
import {MaterialDesignModule} from '../../material-design/material-design.module';
import {GraphComponent} from '../graph/graph.component';
import {LegendSameSpeciesComponent} from '../legend-same-species/legend-same-species.component';
import {ZoomableDirective} from '../directives/zoomable.directive';
import {DraggableDirective} from '../directives/draggable.directive';
import {InteractionService} from '../services/interaction.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {GeneService} from '../services/gene.service';
import {InteractomeService} from '../services/interactome.service';
import {SpeciesService} from '../services/species.service';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {ActivatedRouteStub} from '../../../../testing/activated-route-stub';
import {NotificationService} from '../../notification/services/notification.service';

describe('ChartSameSpeciesComponent', () => {
    let component: ChartSameSpeciesComponent;
    let fixture: ComponentFixture<ChartSameSpeciesComponent>;
    const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
    activatedRoute.snapshot.paramMap = convertToParamMap({id: '04e077f9-ef95-484b-b28a-8798bca1767b'});

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [MaterialDesignModule, HttpClientTestingModule],
            declarations: [ChartSameSpeciesComponent, GraphComponent, LegendSameSpeciesComponent, ZoomableDirective, DraggableDirective],
            providers: [InteractionService, GeneService, InteractomeService, SpeciesService, NotificationService,
                { provide: ActivatedRoute, useValue: activatedRoute }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ChartSameSpeciesComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

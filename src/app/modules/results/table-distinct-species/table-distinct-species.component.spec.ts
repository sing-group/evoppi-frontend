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

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {TableDistinctSpeciesComponent} from './table-distinct-species.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {MaterialDesignModule} from '../../material-design/material-design.module';
import {RouterStub} from '../../../../testing/router-stub';
import {SpeciesService} from '../services/species.service';
import {InteractionService} from '../services/interaction.service';
import {GeneService} from '../services/gene.service';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import {InteractomeService} from '../services/interactome.service';
import {ActivatedRouteStub} from '../../../../testing/activated-route-stub';
import {LegendTableComponent} from '../legend-table/legend-table.component';
import {RouterTestingModule} from '@angular/router/testing';
import {NotificationService} from '../../notification/services/notification.service';

describe('TableDistinctSpeciesComponent', () => {
    let component: TableDistinctSpeciesComponent;
    let fixture: ComponentFixture<TableDistinctSpeciesComponent>;
    const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
    activatedRoute.snapshot.paramMap = convertToParamMap({id: '04e077f9-ef95-484b-b28a-8798bca1767b'});

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [TableDistinctSpeciesComponent, LegendTableComponent],
            imports: [NoopAnimationsModule, MaterialDesignModule, HttpClientTestingModule, RouterTestingModule],
            providers: [InteractionService, GeneService, InteractomeService, SpeciesService, NotificationService,
                { provide: Router, useClass: RouterStub},
                { provide: ActivatedRoute, useValue: activatedRoute }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TableDistinctSpeciesComponent);
        component = fixture.componentInstance;
    });
    /*
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    */
});

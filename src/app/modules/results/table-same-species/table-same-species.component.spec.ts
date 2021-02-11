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

import {TableSameSpeciesComponent} from './table-same-species.component';
import {MaterialDesignModule} from '../../material-design/material-design.module';
import {LegendTableComponent} from '../legend-table/legend-table.component';
import {InteractionService} from '../services/interaction.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {GeneService} from '../services/gene.service';
import {InteractomeService} from '../services/interactome.service';
import {SpeciesService} from '../services/species.service';
import {ActivatedRouteStub} from '../../../../testing/activated-route-stub';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import {RouterStub} from '../../../../testing/router-stub';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {NotificationService} from '../../notification/services/notification.service';

describe('TableSameSpeciesComponent', () => {
    let component: TableSameSpeciesComponent;
    let fixture: ComponentFixture<TableSameSpeciesComponent>;
    const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();
    activatedRoute.snapshot.paramMap = convertToParamMap({id: '04e077f9-ef95-484b-b28a-8798bca1767b'});

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [TableSameSpeciesComponent, LegendTableComponent],
            imports: [NoopAnimationsModule, MaterialDesignModule, HttpClientTestingModule, RouterTestingModule],
            providers: [InteractionService, GeneService, InteractomeService, SpeciesService, NotificationService,
                { provide: Router, useClass: RouterStub},
                { provide: ActivatedRoute, useValue: activatedRoute }
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TableSameSpeciesComponent);
        component = fixture.componentInstance;
    });

    /*
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    */
});

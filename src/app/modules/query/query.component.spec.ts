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

import {QueryComponent} from './query.component';
import {FormDistinctSpeciesComponent} from './form-distinct-species/form-distinct-species.component';
import {FormSameSpeciesComponent} from './form-same-species/form-same-species.component';
import {
    MatCardModule, MatInputModule, MatOptionModule, MatSelectModule, MatSliderModule, MatSnackBarModule,
    MatTabsModule
} from '@angular/material';
import {ActivatedRouteStub} from '../../../testing/activated-route-stub';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterStub} from '../../../testing/router-stub';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('QueryComponent', () => {
    let component: QueryComponent;
    let fixture: ComponentFixture<QueryComponent>;
    const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [QueryComponent, FormDistinctSpeciesComponent, FormSameSpeciesComponent],
            imports: [NoopAnimationsModule, MatTabsModule, MatCardModule, MatOptionModule, MatSelectModule, MatSliderModule,
                MatSnackBarModule, MatInputModule],
            providers: [
                { provide: Router, useClass: RouterStub},
                { provide: ActivatedRoute, useValue: activatedRoute }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(QueryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
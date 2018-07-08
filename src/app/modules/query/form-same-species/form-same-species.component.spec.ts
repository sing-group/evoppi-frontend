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

import {FormSameSpeciesComponent} from './form-same-species.component';
import {MatInputModule, MatOptionModule, MatSelectModule, MatSliderModule, MatSnackBarModule} from '@angular/material';
import {ActivatedRouteStub} from '../../../../testing/activated-route-stub';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterStub} from '../../../../testing/router-stub';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('FormSameSpeciesComponent', () => {
    let component: FormSameSpeciesComponent;
    let fixture: ComponentFixture<FormSameSpeciesComponent>;
    const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FormSameSpeciesComponent],
            imports: [NoopAnimationsModule, MatOptionModule, MatSelectModule, MatSliderModule, MatSnackBarModule, MatInputModule],
            providers: [
                { provide: Router, useClass: RouterStub},
                { provide: ActivatedRoute, useValue: activatedRoute }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormSameSpeciesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

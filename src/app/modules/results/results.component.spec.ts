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

import {ResultsComponent} from './results.component';
import {MatIconModule, MatProgressBarModule, MatSliderModule, MatTooltipModule} from '@angular/material';
import {RouterTestingModule} from '@angular/router/testing';
import {DistinctResultsService} from './services/distinct-results.service';
import {SameResultsService} from './services/same-results.service';
import {of} from 'rxjs/observable/of';
import {ActivatedRouteStub} from '../../../testing/activated-route-stub';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterStub} from '../../../testing/router-stub';

describe('ResultsComponent', () => {
    let component: ResultsComponent;
    let fixture: ComponentFixture<ResultsComponent>;
    const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ResultsComponent],
            imports: [RouterTestingModule, MatTooltipModule, MatSliderModule, MatProgressBarModule, MatIconModule],
            providers: [DistinctResultsService, SameResultsService,
                { provide: Router, useClass: RouterStub},
                { provide: ActivatedRoute, useValue: activatedRoute }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', async(() => {
        spyOn((<any>component).distinctResultsService, 'getResults').and.returnValue(of([]));
        spyOn((<any>component).sameResultsService, 'getResults').and.returnValue(of([]));
        expect(component).toBeTruthy();
    }));
});
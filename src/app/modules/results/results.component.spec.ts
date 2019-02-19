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

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ResultsComponent} from './results.component';
import {RouterTestingModule} from '@angular/router/testing';
import {DistinctResultsService} from './services/distinct-results.service';
import {SameResultsService} from './services/same-results.service';
import {ActivatedRouteStub} from '../../../testing/activated-route-stub';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterStub} from '../../../testing/router-stub';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {InteractomeService} from './services/interactome.service';
import {InteractionService} from './services/interaction.service';
import {SpeciesService} from './services/species.service';
import {GeneService} from './services/gene.service';
import {MaterialDesignModule} from '../material-design/material-design.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {of} from 'rxjs/index';
import {NotificationService} from '../notification/services/notification.service';
import {WorkStatusService} from './services/work-status.service';
import {AuthenticationService} from '../authentication/services/authentication.service';

describe('ResultsComponent', () => {
    let component: ResultsComponent;
    let fixture: ComponentFixture<ResultsComponent>;
    const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ResultsComponent],
            imports: [NoopAnimationsModule, RouterTestingModule, MaterialDesignModule, HttpClientTestingModule],
            providers: [DistinctResultsService, SameResultsService, InteractionService, SpeciesService, GeneService, InteractomeService,
                NotificationService, WorkStatusService, AuthenticationService,
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

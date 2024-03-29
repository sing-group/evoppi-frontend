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

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {FormSameSpeciesComponent} from './form-same-species.component';
import {ActivatedRouteStub} from '../../../../testing/activated-route-stub';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterStub} from '../../../../testing/router-stub';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialDesignModule} from '../../material-design/material-design.module';
import {ReactiveFormsModule} from '@angular/forms';
import {AutocompleteComponent} from '../../data/autocomplete/autocomplete.component';
import {SpeciesService} from '../../results/services/species.service';
import {GeneService} from '../../results/services/gene.service';
import {InteractionService} from '../../results/services/interaction.service';
import {InteractomeService} from '../../results/services/interactome.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NotificationService} from '../../notification/services/notification.service';
import {WorkStatusService} from '../../results/services/work-status.service';

describe('FormSameSpeciesComponent', () => {
    let component: FormSameSpeciesComponent;
    let fixture: ComponentFixture<FormSameSpeciesComponent>;
    const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FormSameSpeciesComponent, AutocompleteComponent],
            imports: [NoopAnimationsModule, MaterialDesignModule, ReactiveFormsModule, HttpClientTestingModule],
            providers: [
                SpeciesService, GeneService, InteractionService, InteractomeService, NotificationService, WorkStatusService,
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

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

import {FormDistinctSpeciesComponent} from './form-distinct-species.component';
import {ActivatedRoute, Router} from '@angular/router';
import {RouterStub} from '../../../../testing/router-stub';
import {ActivatedRouteStub} from '../../../../testing/activated-route-stub';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialDesignModule} from '../../material-design/material-design.module';
import {ReactiveFormsModule} from '@angular/forms';
import {AutocompleteComponent} from '../../data/autocomplete/autocomplete.component';
import {SpeciesService} from '../../results/services/species.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {InteractomeService} from '../../results/services/interactome.service';
import {InteractionService} from '../../results/services/interaction.service';
import {GeneService} from '../../results/services/gene.service';

describe('FormDistinctSpeciesComponent', () => {
    let component: FormDistinctSpeciesComponent;
    let fixture: ComponentFixture<FormDistinctSpeciesComponent>;
    const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FormDistinctSpeciesComponent, AutocompleteComponent],
            imports: [NoopAnimationsModule, MaterialDesignModule, ReactiveFormsModule, HttpClientTestingModule],
            providers: [
                SpeciesService, InteractomeService, InteractionService, GeneService,
                { provide: Router, useClass: RouterStub},
                { provide: ActivatedRoute, useValue: activatedRoute }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormDistinctSpeciesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

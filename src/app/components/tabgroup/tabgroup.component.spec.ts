/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2018 - Noé Vázquez González,
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabgroupComponent } from './tabgroup.component';
import {FormSameSpeciesComponent} from '../form-same-species/form-same-species.component';
import {FormDistinctSpeciesComponent} from '../form-distinct-species/form-distinct-species.component';
import {AppRoutingModule} from '../../app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../app.module';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub, RouterStub} from '../../testing/router-stubs';
import {SpeciesService} from '../../services/species.service';
import {HttpClientModule} from '@angular/common/http';
import {InteractomeService} from '../../services/interactome.service';
import {GeneService} from '../../services/gene.service';
import {InteractionService} from '../../services/interaction.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from '../login/login.component';
import {UserManagerComponent} from '../user-manager/user-manager.component';
import {GraphComponent} from '../graph/graph.component';
import {ZoomableDirective} from '../../directives/zoomable.directive';
import {DraggableDirective} from '../../directives/draggable.directive';
import {D3Service} from '../../services/d3.service';
import {InteractomesComponent} from '../interactomes/interactomes.component';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';

describe('TabgroupComponent', () => {
  let component: TabgroupComponent;
  let fixture: ComponentFixture<TabgroupComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabgroupComponent, FormSameSpeciesComponent, FormDistinctSpeciesComponent, LoginComponent, UserManagerComponent,
        GraphComponent, ZoomableDirective, DraggableDirective, InteractomesComponent, AutocompleteComponent],
      imports: [MaterialModule, FormsModule, BrowserAnimationsModule, ReactiveFormsModule, AppRoutingModule, HttpClientModule ],
      providers: [
        SpeciesService, InteractomeService, GeneService, InteractionService, D3Service,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router,         useClass: RouterStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  /*
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  */
});

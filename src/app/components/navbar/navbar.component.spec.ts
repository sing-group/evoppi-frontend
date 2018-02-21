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

import { NavbarComponent } from './navbar.component';
import {MaterialModule} from '../../app.module';
import {AppComponent} from '../../app.component';
import {FormSameSpeciesComponent} from '../form-same-species/form-same-species.component';
import {FormDistinctSpeciesComponent} from '../form-distinct-species/form-distinct-species.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TabgroupComponent} from '../tabgroup/tabgroup.component';
import {AppRoutingModule} from '../../app-routing.module';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub, RouterStub} from '../../testing/router-stubs';
import {LoginComponent} from '../login/login.component';
import {HttpClientModule} from '@angular/common/http';
import {UserManagerComponent} from '../user-manager/user-manager.component';
import {AuthService} from '../../services/auth.service';
import {GraphComponent} from '../graph/graph.component';
import {ZoomableDirective} from '../../directives/zoomable.directive';
import {DraggableDirective} from '../../directives/draggable.directive';
import {InteractomesComponent} from '../interactomes/interactomes.component';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';
import {LegendDistinctSpeciesComponent} from '../legend-distinct-species/legend-distinct-species.component';
import {LegendSameSpeciesComponent} from '../legend-same-species/legend-same-species.component';
import {UserWorkManagerComponent} from '../user-work-manager/user-work-manager.component';
import {UserTableComponent} from '../user-table/user-table.component';
import {UserCreateComponent} from '../user-create/user-create.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent, FormDistinctSpeciesComponent, FormSameSpeciesComponent, NavbarComponent, TabgroupComponent,
        LoginComponent, UserManagerComponent, GraphComponent, ZoomableDirective, DraggableDirective, InteractomesComponent,
        AutocompleteComponent, LegendDistinctSpeciesComponent, LegendSameSpeciesComponent, UserWorkManagerComponent, UserTableComponent,
        UserCreateComponent],
      imports: [MaterialModule, FormsModule, ReactiveFormsModule, AppRoutingModule, HttpClientModule ],
      providers: [
        AuthService,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router,         useClass: RouterStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

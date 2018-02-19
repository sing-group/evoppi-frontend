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

import { LoginComponent } from './login.component';
import {AppRoutingModule} from '../../app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../app.module';
import {FormDistinctSpeciesComponent} from '../form-distinct-species/form-distinct-species.component';
import {FormSameSpeciesComponent} from '../form-same-species/form-same-species.component';
import {NavbarComponent} from '../navbar/navbar.component';
import {TabgroupComponent} from '../tabgroup/tabgroup.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub, RouterStub} from '../../testing/router-stubs';
import {UserService} from '../../services/user.service';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {APP_BASE_HREF} from '@angular/common';
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

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDistinctSpeciesComponent, FormSameSpeciesComponent, NavbarComponent, TabgroupComponent, LoginComponent,
        UserManagerComponent, GraphComponent, ZoomableDirective, DraggableDirective, InteractomesComponent, AutocompleteComponent,
        LegendDistinctSpeciesComponent, LegendSameSpeciesComponent, UserWorkManagerComponent, UserTableComponent],
      imports: [MaterialModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule, AppRoutingModule, HttpClientModule ],
      providers: [
        UserService, AuthService,
        { provide: APP_BASE_HREF, useValue: '/' },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router,         useClass: RouterStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

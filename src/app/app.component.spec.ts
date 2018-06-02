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

import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import {MaterialModule} from './app.module';
import {FormSameSpeciesComponent} from './components/form-same-species/form-same-species.component';
import {FormDistinctSpeciesComponent} from './components/form-distinct-species/form-distinct-species.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {SpeciesService} from './services/species.service';
import {HttpClientModule} from '@angular/common/http';
import {InteractomeService} from './services/interactome.service';
import {GeneService} from './services/gene.service';
import {InteractionService} from './services/interaction.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {TabgroupComponent} from './components/tabgroup/tabgroup.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub, RouterStub} from './testing/router-stubs';
import {LoginComponent} from './components/login/login.component';
import {UserService} from './services/user.service';
import {UserManagerComponent} from './components/user-manager/user-manager.component';
import {AuthService} from './services/auth.service';
import {GraphComponent} from './components/graph/graph.component';
import {ZoomableDirective} from './directives/zoomable.directive';
import {DraggableDirective} from './directives/draggable.directive';
import {InteractomesComponent} from './components/interactomes/interactomes.component';
import {AutocompleteComponent} from './components/autocomplete/autocomplete.component';
import {LegendDistinctSpeciesComponent} from './components/legend-distinct-species/legend-distinct-species.component';
import {LegendSameSpeciesComponent} from './components/legend-same-species/legend-same-species.component';
import {UserWorkManagerComponent} from './components/user-work-manager/user-work-manager.component';
import {UserTableComponent} from './components/user-table/user-table.component';
import {UserCreateComponent} from './components/user-create/user-create.component';
import {LegendTableComponent} from './components/legend-table/legend-table.component';


describe('AppComponent', () => {

  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent, FormDistinctSpeciesComponent, FormSameSpeciesComponent, NavbarComponent, TabgroupComponent,
        LoginComponent, UserManagerComponent, GraphComponent, ZoomableDirective, DraggableDirective, InteractomesComponent,
        AutocompleteComponent, LegendDistinctSpeciesComponent, LegendSameSpeciesComponent, UserWorkManagerComponent, UserTableComponent,
        UserCreateComponent, LegendTableComponent,
      ],
      imports: [MaterialModule, HttpClientModule, FormsModule, ReactiveFormsModule, AppRoutingModule ],
      providers: [SpeciesService, InteractomeService, GeneService, InteractionService, UserService, AuthService,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router,         useClass: RouterStub},
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));


  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    // fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('app-navbar').textContent).toContain('EvoPPI');
  }));

});


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

import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { FormSameSpeciesComponent } from './form-same-species.component';
import {MaterialModule} from '../../app.module';
import {HttpClientModule} from '@angular/common/http';
import {SpeciesService} from '../../services/species.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InteractomeService} from '../../services/interactome.service';
import {GeneService} from '../../services/gene.service';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {InteractionService} from '../../services/interaction.service';
import {GraphComponent} from '../graph/graph.component';
import {ZoomableDirective} from '../../directives/zoomable.directive';
import {DraggableDirective} from '../../directives/draggable.directive';
import {D3Service} from '../../services/d3.service';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';
import {LegendSameSpeciesComponent} from '../legend-same-species/legend-same-species.component';

describe('FormSameSpeciesComponent', () => {
  let component: FormSameSpeciesComponent;
  let fixture: ComponentFixture<FormSameSpeciesComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSameSpeciesComponent, GraphComponent, ZoomableDirective, DraggableDirective, AutocompleteComponent,
        LegendSameSpeciesComponent],
      imports: [ BrowserAnimationsModule, MaterialModule, HttpClientModule, FormsModule, ReactiveFormsModule ],
      providers: [ SpeciesService, InteractomeService, GeneService, InteractionService, D3Service ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSameSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDistinctSpeciesComponent } from './form-distinct-species.component';
import {MaterialModule} from '../../app.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GeneService} from '../../services/gene.service';
import {InteractomeService} from '../../services/interactome.service';
import {SpeciesService} from '../../services/species.service';
import {HttpClientModule} from '@angular/common/http';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {GraphComponent} from '../graph/graph.component';
import {DraggableDirective} from '../../directives/draggable.directive';
import {InteractionService} from '../../services/interaction.service';
import {D3Service} from '../../services/d3.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ZoomableDirective} from '../../directives/zoomable.directive';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';

describe('FormDistinctSpeciesComponent', () => {
  let component: FormDistinctSpeciesComponent;
  let fixture: ComponentFixture<FormDistinctSpeciesComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDistinctSpeciesComponent, GraphComponent, ZoomableDirective, DraggableDirective, AutocompleteComponent ],
      imports: [ BrowserAnimationsModule, MaterialModule, HttpClientModule, FormsModule, ReactiveFormsModule ],
      providers: [ SpeciesService, InteractomeService, GeneService, InteractionService, D3Service ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDistinctSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});

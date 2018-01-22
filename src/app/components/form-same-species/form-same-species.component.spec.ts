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

describe('FormSameSpeciesComponent', () => {
  let component: FormSameSpeciesComponent;
  let fixture: ComponentFixture<FormSameSpeciesComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSameSpeciesComponent, GraphComponent, ZoomableDirective, DraggableDirective, AutocompleteComponent ],
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

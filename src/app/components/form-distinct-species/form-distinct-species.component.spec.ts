import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { FormDistinctSpeciesComponent } from './form-distinct-species.component';
import {MaterialModule} from '../../app.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GeneService} from '../../services/gene.service';
import {InteractomeService} from '../../services/interactome.service';
import {SpeciesService} from '../../services/species.service';
import {HttpClientModule} from '@angular/common/http';
import {DebugElement} from '@angular/core';
import {GraphComponent} from '../graph/graph.component';
import {DraggableDirective} from '../../directives/draggable.directive';
import {InteractionService} from '../../services/interaction.service';
import {D3Service} from '../../services/d3.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ZoomableDirective} from '../../directives/zoomable.directive';
import {AutocompleteComponent} from '../autocomplete/autocomplete.component';
import {LegendDistinctSpeciesComponent} from '../legend-distinct-species/legend-distinct-species.component';
import {FakeInteractionService} from '../../testing/fake-interaction.service';
import Spy = jasmine.Spy;

describe('FormDistinctSpeciesComponent', () => {
  let component: FormDistinctSpeciesComponent;
  let fixture: ComponentFixture<FormDistinctSpeciesComponent>;
  let de: DebugElement;
  let interactionService: InteractionService;
  let spy: Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDistinctSpeciesComponent, GraphComponent, ZoomableDirective, DraggableDirective, AutocompleteComponent,
        LegendDistinctSpeciesComponent],
      imports: [ BrowserAnimationsModule, MaterialModule, HttpClientModule, FormsModule, ReactiveFormsModule ],
      providers: [ SpeciesService, InteractomeService, GeneService, D3Service,
        {
          provide: InteractionService, useClass: FakeInteractionService
        }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDistinctSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    interactionService = fixture.debugElement.injector.get(InteractionService);
    spy = spyOn(interactionService, 'getInteractionResult').and.callThrough();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create correct nodes, links and table for different species',  async(() => {

    component.getResult('differentSpecies');
    const res = spy.calls.mostRecent().returnValue.value;

    expect(res).toBe(FakeInteractionService.RESULT_DIFF);
    expect(component.nodes.length).toBe(6);
    expect(component.links.length).toBe(4);
    expect(component.referenceInteraction.length).toBe(5);

    expect(component.nodes[0].label).toBe(100);
    expect(component.nodes[1].label).toBe(101);
    expect(component.nodes[2].label).toBe(110);
    expect(component.nodes[3].label).toBe(111);
    expect(component.nodes[4].label).toBe(120);
    expect(component.nodes[5].label).toBe(121);

    expect(component.nodes[0].type).toBe(2);
    expect(component.nodes[1].type).toBe(2);
    expect(component.nodes[2].type).toBe(1);
    expect(component.nodes[3].type).toBe(1);
    expect(component.nodes[4].type).toBe(2);
    expect(component.nodes[5].type).toBe(2);

    expect(component.nodes[0].linkCount).toBe(1);
    expect(component.nodes[1].linkCount).toBe(0);
    expect(component.nodes[2].linkCount).toBe(0);
    expect(component.nodes[3].linkCount).toBe(1);
    expect(component.nodes[4].linkCount).toBe(0);
    expect(component.nodes[5].linkCount).toBe(0);

    expect(component.links[0].type).toBe(3);
    expect(component.links[1].type).toBe(1);
    expect(component.links[2].type).toBe(1);
    expect(component.links[3].type).toBe(1);

    expect(component.referenceInteraction[0].geneA).toBe(100);
    expect(component.referenceInteraction[1].geneA).toBe(110);
    expect(component.referenceInteraction[2].geneA).toBe(100);
    expect(component.referenceInteraction[3].geneA).toBe(120);
    expect(component.referenceInteraction[4].geneA).toBe(200);

    expect(component.referenceInteraction[0].geneB).toBe(101);
    expect(component.referenceInteraction[1].geneB).toBe(111);
    expect(component.referenceInteraction[2].geneB).toBe(111);
    expect(component.referenceInteraction[3].geneB).toBe(121);
    expect(component.referenceInteraction[4].geneB).toBe(201);

    console.log('res', res);

    console.log(component.nodes);
    console.log(component.links);

    console.log(component.referenceInteraction);



    console.log('end');

  }));

});

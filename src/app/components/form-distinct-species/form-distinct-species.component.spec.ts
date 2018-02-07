import {async, ComponentFixture, TestBed} from '@angular/core/testing';

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

    component.getResult('differentSpecies');

  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create correct node count',  async(() => {
    const res = spy.calls.mostRecent().returnValue.value;
    expect(res).toBe(FakeInteractionService.RESULT_DIFF);
    expect(component.nodes.length).toBe(6);
  }));

  it('should create correct node labels',  async(() => {
    expect(component.nodes[0].label).toBe(100);
    expect(component.nodes[1].label).toBe(101);
    expect(component.nodes[2].label).toBe(110);
    expect(component.nodes[3].label).toBe(111);
    expect(component.nodes[4].label).toBe(120);
    expect(component.nodes[5].label).toBe(121);
  }));

  it('should create correct node types',  async(() => {
    expect(component.nodes[0].type).toBe(2);
    expect(component.nodes[1].type).toBe(2);
    expect(component.nodes[2].type).toBe(1);
    expect(component.nodes[3].type).toBe(1);
    expect(component.nodes[4].type).toBe(2);
    expect(component.nodes[5].type).toBe(2);
  }));

  it('should create correct node link count',  async(() => {
    expect(component.nodes[0].linkCount).toBe(2);
    expect(component.nodes[1].linkCount).toBe(2);
    expect(component.nodes[2].linkCount).toBe(1);
    expect(component.nodes[3].linkCount).toBe(2);
    expect(component.nodes[4].linkCount).toBe(1);
    expect(component.nodes[5].linkCount).toBe(2);
  }));

  it('should create correct link count',  async(() => {
    expect(component.links.length).toBe(5);
  }));

  it('should create correct link types',  async(() => {
    expect(component.links[0].type).toBe(3);
    expect(component.links[1].type).toBe(1);
    expect(component.links[2].type).toBe(2);
    expect(component.links[3].type).toBe(1);

  }));

  it('should create correct table row count',  async(() => {
    const consolidatedInteractions = component.dataSource.data;
    expect(consolidatedInteractions.length).toBe(5);
  }));

  it('should create correct table geneA',  async(() => {
    const consolidatedInteractions = component.dataSource.data;
    expect(consolidatedInteractions[0].geneA).toBe(100);
    expect(consolidatedInteractions[1].geneA).toBe(100);
    expect(consolidatedInteractions[2].geneA).toBe(101);
    expect(consolidatedInteractions[3].geneA).toBe(110);
    expect(consolidatedInteractions[4].geneA).toBe(120);
  }));

  it('should create correct table geneB',  async(() => {
    const consolidatedInteractions = component.dataSource.data;
    expect(consolidatedInteractions[0].geneB).toBe(101);
    expect(consolidatedInteractions[1].geneB).toBe(111);
    expect(consolidatedInteractions[2].geneB).toBe(121);
    expect(consolidatedInteractions[3].geneB).toBe(111);
    expect(consolidatedInteractions[4].geneB).toBe(121);
  }));

});

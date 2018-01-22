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

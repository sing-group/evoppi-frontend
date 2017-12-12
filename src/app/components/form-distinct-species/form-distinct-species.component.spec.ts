import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDistinctSpeciesComponent } from './form-distinct-species.component';
import {MaterialModule} from '../../app.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GeneService} from '../../services/gene.service';
import {InteractomeService} from '../../services/interactome.service';
import {SpeciesService} from '../../services/species.service';
import {HttpClientModule} from '@angular/common/http';

describe('FormDistinctSpeciesComponent', () => {
  let component: FormDistinctSpeciesComponent;
  let fixture: ComponentFixture<FormDistinctSpeciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDistinctSpeciesComponent ],
      imports: [ BrowserAnimationsModule, MaterialModule, HttpClientModule ],
      providers: [ SpeciesService, InteractomeService, GeneService ]
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

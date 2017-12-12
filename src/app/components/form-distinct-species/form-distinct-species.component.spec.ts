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

describe('FormDistinctSpeciesComponent', () => {
  let component: FormDistinctSpeciesComponent;
  let fixture: ComponentFixture<FormDistinctSpeciesComponent>;
  let de: DebugElement;

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

  it('should display a form with class form-distinct-species', () => {
    de = fixture.debugElement.query(By.css('.form-distinct-species'));
    expect(de.nativeElement).toBeTruthy();
  });
});

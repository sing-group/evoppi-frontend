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

describe('FormSameSpeciesComponent', () => {
  let component: FormSameSpeciesComponent;
  let fixture: ComponentFixture<FormSameSpeciesComponent>;
  let de: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSameSpeciesComponent ],
      imports: [ BrowserAnimationsModule, MaterialModule, HttpClientModule, FormsModule, ReactiveFormsModule ],
      providers: [ SpeciesService, InteractomeService, GeneService, InteractionService ]
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

  it('should display a form with class form-same-species', () => {
    de = fixture.debugElement.query(By.css('.form-same-species'));
    expect(de.nativeElement).toBeTruthy();
  });
});

import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import { FormSameSpeciesComponent } from './form-same-species.component';
import {MaterialModule} from '../../app.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {SpeciesService} from '../../services/species.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('FormSameSpeciesComponent', () => {
  let component: FormSameSpeciesComponent;
  let fixture: ComponentFixture<FormSameSpeciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSameSpeciesComponent ],
      imports: [ BrowserAnimationsModule, MaterialModule, HttpClientModule ],
      providers: [ SpeciesService ]
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

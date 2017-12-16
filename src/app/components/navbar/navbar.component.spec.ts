import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import {MaterialModule} from '../../app.module';
import {AppComponent} from '../../app.component';
import {FormSameSpeciesComponent} from '../form-same-species/form-same-species.component';
import {FormDistinctSpeciesComponent} from '../form-distinct-species/form-distinct-species.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent, FormDistinctSpeciesComponent, FormSameSpeciesComponent, NavbarComponent ],
      imports: [MaterialModule, FormsModule, ReactiveFormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

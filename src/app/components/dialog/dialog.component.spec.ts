import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';
import {MaterialModule} from '../../app.module';
import {MAT_DIALOG_DATA} from '@angular/material';
import {ActivatedRouteStub, RouterStub} from '../../testing/router-stubs';
import {ActivatedRoute, Router} from '@angular/router';
import {AppRoutingModule} from '../../app-routing.module';
import {TabgroupComponent} from '../tabgroup/tabgroup.component';
import {LoginComponent} from '../login/login.component';
import {FormDistinctSpeciesComponent} from '../form-distinct-species/form-distinct-species.component';
import {FormSameSpeciesComponent} from '../form-same-species/form-same-species.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {APP_BASE_HREF} from '@angular/common';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogComponent, TabgroupComponent, LoginComponent, FormDistinctSpeciesComponent, FormSameSpeciesComponent ],
      imports: [MaterialModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule, AppRoutingModule, HttpClientModule ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { title: 'test title', content: 'test content'}},
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router,         useClass: RouterStub},
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

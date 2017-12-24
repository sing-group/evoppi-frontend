import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import {MaterialModule} from '../../app.module';
import {AppComponent} from '../../app.component';
import {FormSameSpeciesComponent} from '../form-same-species/form-same-species.component';
import {FormDistinctSpeciesComponent} from '../form-distinct-species/form-distinct-species.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TabgroupComponent} from '../tabgroup/tabgroup.component';
import {AppRoutingModule} from '../../app-routing.module';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub, RouterStub} from '../../testing/router-stubs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent, FormDistinctSpeciesComponent, FormSameSpeciesComponent, NavbarComponent, TabgroupComponent ],
      imports: [MaterialModule, FormsModule, ReactiveFormsModule, AppRoutingModule ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router,         useClass: RouterStub},
      ]
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

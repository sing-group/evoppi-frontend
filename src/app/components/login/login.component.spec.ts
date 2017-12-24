import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {AppRoutingModule} from '../../app-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../app.module';
import {FormDistinctSpeciesComponent} from '../form-distinct-species/form-distinct-species.component';
import {FormSameSpeciesComponent} from '../form-same-species/form-same-species.component';
import {NavbarComponent} from '../navbar/navbar.component';
import {TabgroupComponent} from '../tabgroup/tabgroup.component';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub, RouterStub} from '../../testing/router-stubs';
import {UserService} from '../../services/user.service';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormDistinctSpeciesComponent, FormSameSpeciesComponent, NavbarComponent, TabgroupComponent, LoginComponent ],
      imports: [MaterialModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule, AppRoutingModule, HttpClientModule ],
      providers: [
        UserService,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router,         useClass: RouterStub},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

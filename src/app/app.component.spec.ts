import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import {MaterialModule} from './app.module';
import {FormSameSpeciesComponent} from './form-same-species/form-same-species.component';
import {FormDistinctSpeciesComponent} from './form-distinct-species/form-distinct-species.component';
import {NavbarComponent} from './navbar/navbar.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent, FormDistinctSpeciesComponent, FormSameSpeciesComponent, NavbarComponent ],
      imports: [MaterialModule]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app');
  }));


  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    // fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('EvoPPI');
  }));

});

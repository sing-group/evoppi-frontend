import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartDistinctSpeciesComponent } from './chart-distinct-species.component';

describe('ChartDistinctSpeciesComponent', () => {
  let component: ChartDistinctSpeciesComponent;
  let fixture: ComponentFixture<ChartDistinctSpeciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartDistinctSpeciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartDistinctSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

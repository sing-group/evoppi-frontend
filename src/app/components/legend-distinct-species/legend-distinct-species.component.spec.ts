import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendDistinctSpeciesComponent } from './legend-distinct-species.component';

describe('LegendDistinctSpeciesComponent', () => {
  let component: LegendDistinctSpeciesComponent;
  let fixture: ComponentFixture<LegendDistinctSpeciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegendDistinctSpeciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendDistinctSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

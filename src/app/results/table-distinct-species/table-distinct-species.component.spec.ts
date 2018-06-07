import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDistinctSpeciesComponent } from './table-distinct-species.component';

describe('TableDistinctSpeciesComponent', () => {
  let component: TableDistinctSpeciesComponent;
  let fixture: ComponentFixture<TableDistinctSpeciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableDistinctSpeciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDistinctSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

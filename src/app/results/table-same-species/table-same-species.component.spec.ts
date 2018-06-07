import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSameSpeciesComponent } from './table-same-species.component';

describe('TableSameSpeciesComponent', () => {
  let component: TableSameSpeciesComponent;
  let fixture: ComponentFixture<TableSameSpeciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableSameSpeciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSameSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSameSpeciesComponent } from './chart-same-species.component';

describe('ChartSameSpeciesComponent', () => {
  let component: ChartSameSpeciesComponent;
  let fixture: ComponentFixture<ChartSameSpeciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartSameSpeciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSameSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendSameSpeciesComponent } from './legend-same-species.component';

describe('LegendSameSpeciesComponent', () => {
  let component: LegendSameSpeciesComponent;
  let fixture: ComponentFixture<LegendSameSpeciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegendSameSpeciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendSameSpeciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

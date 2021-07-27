import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictomeListComponent } from './predictome-list.component';

describe('PredictomeListComponent', () => {
  let component: PredictomeListComponent;
  let fixture: ComponentFixture<PredictomeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictomeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictomeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

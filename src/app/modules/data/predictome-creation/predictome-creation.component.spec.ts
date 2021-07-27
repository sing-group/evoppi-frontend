import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredictomeCreationComponent } from './predictome-creation.component';

describe('PredictomeCreationComponent', () => {
  let component: PredictomeCreationComponent;
  let fixture: ComponentFixture<PredictomeCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredictomeCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredictomeCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

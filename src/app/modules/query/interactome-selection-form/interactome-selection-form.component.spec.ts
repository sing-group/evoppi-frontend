import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractomeSelectionFormComponent } from './interactome-selection-form.component';

describe('InteractomeSelectionFormComponent', () => {
  let component: InteractomeSelectionFormComponent;
  let fixture: ComponentFixture<InteractomeSelectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteractomeSelectionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractomeSelectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

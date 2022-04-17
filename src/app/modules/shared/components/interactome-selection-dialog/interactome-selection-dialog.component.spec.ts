import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractomeSelectionDialogComponent } from './interactome-selection-dialog.component';

describe('InteractomeSelectionDialogComponent', () => {
  let component: InteractomeSelectionDialogComponent;
  let fixture: ComponentFixture<InteractomeSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteractomeSelectionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractomeSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

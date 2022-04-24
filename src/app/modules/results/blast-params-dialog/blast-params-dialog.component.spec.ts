import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlastParamsDialogComponent } from './blast-params-dialog.component';

describe('BlastParamsDialogComponent', () => {
  let component: BlastParamsDialogComponent;
  let fixture: ComponentFixture<BlastParamsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlastParamsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlastParamsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

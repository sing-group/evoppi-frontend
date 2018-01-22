  import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractomesComponent } from './interactomes.component';
  import {MaterialModule} from '../../app.module';

describe('InteractomesComponent', () => {
  let component: InteractomesComponent;
  let fixture: ComponentFixture<InteractomesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractomesComponent ],
      imports: [ MaterialModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

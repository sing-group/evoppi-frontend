import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphComponent } from './graph.component';
import {DraggableDirective} from '../../directives/draggable.directive';
import {ZoomableDirective} from '../../directives/zoomable.directive';
import {D3Service} from '../../services/d3.service';

describe('GraphComponent', () => {
  let component: GraphComponent;
  let fixture: ComponentFixture<GraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphComponent, ZoomableDirective, DraggableDirective ],
      providers: [ D3Service ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*
  it('should create', () => {
     expect(component).toBeTruthy();
  });
  */
});

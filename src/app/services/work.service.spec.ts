import { TestBed, inject } from '@angular/core/testing';

import { WorkService } from './work.service';
import {HttpClientModule} from '@angular/common/http';

describe('WorkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkService],
      imports: [ HttpClientModule ],
    });
  });

  it('should be created', inject([WorkService], (service: WorkService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed } from '@angular/core/testing';

import { PredictomeService } from './predictome.service';

describe('PredictomeService', () => {
  let service: PredictomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PredictomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

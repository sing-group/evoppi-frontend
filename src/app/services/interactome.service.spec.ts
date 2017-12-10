import { TestBed, inject } from '@angular/core/testing';

import { InteractomeService } from './interactome.service';
import {HttpClientModule} from '@angular/common/http';

describe('InteractomeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InteractomeService],
      imports: [ HttpClientModule ],
    });
  });

  it('should be created', inject([InteractomeService], (service: InteractomeService) => {
    expect(service).toBeTruthy();
  }));
});

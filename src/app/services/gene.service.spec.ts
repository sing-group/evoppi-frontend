import { TestBed, inject } from '@angular/core/testing';

import { GeneService } from './gene.service';
import {HttpClientModule} from '@angular/common/http';

describe('GeneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeneService],
      imports: [ HttpClientModule ],
    });
  });

  it('should be created', inject([GeneService], (service: GeneService) => {
    expect(service).toBeTruthy();
  }));
});

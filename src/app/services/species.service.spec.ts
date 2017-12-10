import { TestBed, inject } from '@angular/core/testing';

import { SpeciesService } from './species.service';
import {HttpClientModule} from '@angular/common/http';

describe('SpeciesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpeciesService],
      imports: [ HttpClientModule ],
    });
  });

  it('should be created', inject([SpeciesService], (service: SpeciesService) => {
    expect(service).toBeTruthy();
  }));
});

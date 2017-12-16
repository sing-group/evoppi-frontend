import { TestBed, inject } from '@angular/core/testing';

import { InteractionService } from './interaction.service';
import {HttpClientModule} from '@angular/common/http';

describe('InteractionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InteractionService],
      imports: [ HttpClientModule ],
    });
  });

  it('should be created', inject([InteractionService], (service: InteractionService) => {
    expect(service).toBeTruthy();
  }));
});

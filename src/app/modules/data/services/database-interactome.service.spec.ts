import { TestBed } from '@angular/core/testing';

import { DatabaseInteractomeService } from './database-interactome.service';

describe('DatabaseInteractomeService', () => {
  let service: DatabaseInteractomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseInteractomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

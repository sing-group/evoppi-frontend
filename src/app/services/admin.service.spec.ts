import { TestBed, inject } from '@angular/core/testing';

import { AdminService } from './admin.service';
import {HttpClientModule} from '@angular/common/http';

describe('AdminService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminService],
      imports: [ HttpClientModule ],
    });
  });

  it('should be created', inject([AdminService], (service: AdminService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed } from '@angular/core/testing';

import { DailychartService } from './dailychart.service';

describe('DailychartService', () => {
  let service: DailychartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailychartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

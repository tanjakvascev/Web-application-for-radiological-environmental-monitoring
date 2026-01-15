import { TestBed } from '@angular/core/testing';

import { IsotopeService } from './isotope.service';

describe('IsotopeService', () => {
  let service: IsotopeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsotopeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { DescriptsService } from './descripts.service';

describe('DescriptsService', () => {
  let service: DescriptsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DescriptsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

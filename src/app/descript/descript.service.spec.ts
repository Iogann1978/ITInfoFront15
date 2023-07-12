import { TestBed } from '@angular/core/testing';

import { DescriptService } from './descript.service';

describe('DescriptService', () => {
  let service: DescriptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DescriptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

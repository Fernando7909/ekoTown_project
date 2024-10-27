import { TestBed } from '@angular/core/testing';

import { StoreSearchService } from './store-search.service';

describe('StoreSearchService', () => {
  let service: StoreSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

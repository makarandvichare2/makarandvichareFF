import { TestBed } from '@angular/core/testing';

import { NewsNgRxService } from './news-ng-rx.service';

describe('NewsNgRxService', () => {
  let service: NewsNgRxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsNgRxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

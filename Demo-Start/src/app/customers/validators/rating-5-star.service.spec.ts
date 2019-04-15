import { TestBed } from '@angular/core/testing';

import { Rating5StarService } from './rating-5-star.service';

describe('Rating5StarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Rating5StarService = TestBed.get(Rating5StarService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ModuleDataService } from './module-data.service';

describe('ModuleDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModuleDataService = TestBed.get(ModuleDataService);
    expect(service).toBeTruthy();
  });
});

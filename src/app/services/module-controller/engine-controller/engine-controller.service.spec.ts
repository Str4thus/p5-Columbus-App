import { TestBed } from '@angular/core/testing';

import { EngineControllerService } from './engine-controller.service';

describe('EngineControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EngineControllerService = TestBed.get(EngineControllerService);
    expect(service).toBeTruthy();
  });
});

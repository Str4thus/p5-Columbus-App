import { TestBed } from '@angular/core/testing';

import { LidarControllerService } from './lidar-controller.service';

describe('LidarControllerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LidarControllerService = TestBed.get(LidarControllerService);
    expect(service).toBeTruthy();
  });
});

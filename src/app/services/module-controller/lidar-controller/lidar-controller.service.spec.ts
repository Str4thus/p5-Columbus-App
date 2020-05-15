import { TestBed } from '@angular/core/testing';

import { LidarControllerService } from './lidar-controller.service';
import { ModuleDataService } from '../../module-data/module-data.service';
import { createMockModuleDataService } from 'src/columbus/mocking/Mocks.spec';


describe('LidarControllerService', () => {
  let service: LidarControllerService;
  let mockModuleDataService;

  beforeEach(() => {
    // Mock
    mockModuleDataService = createMockModuleDataService();

    // Module
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ModuleDataService,
          useValue: mockModuleDataService,
        }
      ]
    });

    // Service
    service = TestBed.get(LidarControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("Controller Functionality", () => {
    // TODO add tests
  });
});

import { TestBed } from '@angular/core/testing';

import { LidarControllerService } from './lidar-controller.service';
import { ModuleDataService } from '../../module-data/module-data.service';
import { createMockModuleDataServiceForControllers } from 'src/columbus/util/Mocks.spec';
import { ColumbusModuleState } from 'src/columbus/data-models/modules/ColumbusModuleState';
import { ILidarStateData } from 'src/columbus/data-models/modules/concrete-states/ILidarStateData';

describe('LidarControllerService', () => {
  let service: LidarControllerService;
  let currentModuleState: ColumbusModuleState;
  let mockModuleDataService;

  const startState: ILidarStateData = {}
  beforeEach(() => {
    // Data
    currentModuleState = new ColumbusModuleState(startState);

    // Mocks
    mockModuleDataService = createMockModuleDataServiceForControllers();

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

  });
});

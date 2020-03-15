import { TestBed } from '@angular/core/testing';

import { EngineControllerService } from './engine-controller.service';
import { createMockModuleDataServiceForControllers } from 'src/columbus/util/Mocks.spec';
import { ModuleDataService } from '../../module-data/module-data.service';
import { LidarControllerService } from '../lidar-controller/lidar-controller.service';
import { ColumbusModuleState } from 'src/columbus/data-models/modules/ColumbusModuleState';
import { IEngineStateData } from 'src/columbus/data-models/modules/concrete-states/IEngineStateData';

describe('EngineControllerService', () => {
  let service: LidarControllerService;
  let currentModuleState: ColumbusModuleState;
  let mockModuleDataSerivce;

  const startState: IEngineStateData = { }
  beforeEach(() => {
    // Data
    currentModuleState = new ColumbusModuleState(startState);

    // Mocks
    mockModuleDataSerivce = createMockModuleDataServiceForControllers();

    // Module
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ModuleDataService,
          useValue: mockModuleDataSerivce,
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

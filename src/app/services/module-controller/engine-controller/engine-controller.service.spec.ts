import { TestBed } from '@angular/core/testing';

import { EngineControllerService } from './engine-controller.service';
import { ModuleDataService } from '../../module-data/module-data.service';
import { LidarControllerService } from '../lidar-controller/lidar-controller.service';
import { IEngineStateData } from 'src/columbus/data-models/modules/concrete-states/IEngineStateData';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';
import { ColumbusModuleType } from 'src/columbus/util/Enums';

/*
describe('EngineControllerService', () => {
  let service: LidarControllerService;
  let currentModuleState: ColumbusModule;
  let mockModuleDataSerivce;

  const startState: IEngineStateData = { }
  beforeEach(() => {
    // Data
    currentModuleState = new ColumbusModule(ColumbusModuleType.TEST, startState);

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
});*/

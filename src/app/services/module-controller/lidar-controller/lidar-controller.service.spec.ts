import { TestBed } from '@angular/core/testing';

import { LidarControllerService } from './lidar-controller.service';
import { ModuleDataService } from '../../module-data/module-data.service';
import { ILidarStateData } from 'src/columbus/data-models/modules/concrete-states/ILidarStateData';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';
import { ColumbusModuleType } from 'src/columbus/util/Enums';

/*
describe('LidarControllerService', () => {
  let service: LidarControllerService;
  let currentModuleState: ColumbusModule;
  let mockModuleDataService;

  const startState: ILidarStateData = {}
  beforeEach(() => {
    // Data
    currentModuleState = new ColumbusModule(ColumbusModuleType.TEST,startState);

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
});*/

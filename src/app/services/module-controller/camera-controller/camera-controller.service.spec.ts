import { TestBed } from '@angular/core/testing';

import { CameraControllerService } from './camera-controller.service';
import { ModuleDataService } from '../../module-data/module-data.service';
import { ColumbusModuleState } from 'src/columbus/data-models/modules/ColumbusModuleState';
import { ICameraStateData } from 'src/columbus/data-models/modules/concrete-states/ICameraStateData';
import { createMockModuleDataServiceForControllers } from 'src/columbus/util/Mocks.spec';

describe('CameraControllerService', () => {
  let service: CameraControllerService;
  let currentModuleState: ColumbusModuleState;
  let mockModuleDataService;

  const startState: ICameraStateData = {
    vrot: 0,
    hrot: 0
  }

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
    service = TestBed.get(CameraControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("Controller Functionality", () => {
    it('can rotate camera vertically', () => {
      let expectedModuleState = startState;
      expectedModuleState.vrot = 40;

      service.rotateVertically(40);

      expect(mockModuleDataService.updateModuleState).toHaveBeenCalled();
      expect(currentModuleState.value).toEqual(expectedModuleState);
    });

    it('can rotate camera horizontally', () => {
      let expectedModuleState = startState;
      expectedModuleState.hrot = 40;

      service.rotateHorizontally(40);

      expect(mockModuleDataService.updateModuleState).toHaveBeenCalled();
      expect(currentModuleState.value).toEqual(expectedModuleState);
    });
  });
});

import { TestBed } from '@angular/core/testing';

import { CameraControllerService } from './camera-controller.service';
import { ModuleDataService } from '../../module-data/module-data.service';
import { ColumbusModuleState } from 'src/columbus/data-models/modules/ColumbusModuleState';
import { ICameraState } from 'src/columbus/data-models/modules/concrete-states/ICameraState';

describe('CameraControllerService', () => {
  let service: CameraControllerService;
  let currentModuleState: ColumbusModuleState;
  let mockModuleDataService;
  
  const startState: ICameraState = {
    vrot: 0
  }

  beforeEach(() => {
    // Data
    currentModuleState = new ColumbusModuleState(startState);

    // Mocks  
    mockModuleDataService = jasmine.createSpyObj("mockModuleDataService", ["getModuleState", "updateModuleState", "generateCommand", "requestToSendCommand"]);
    mockModuleDataService.updateModuleState.and.callFake((_, newState) => {
      currentModuleState.next(newState.value);
    });

    mockModuleDataService.getModuleState.and.callFake(() => {
      return currentModuleState
    })

    // Module
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ModuleDataService,
          useValue: mockModuleDataService,
        }
      ]
    })

    // Service
    service = TestBed.get(CameraControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update', () => {
    let expectedModuleState = startState;
    expectedModuleState.vrot = 40;

    service.turnUp(40);

    console.log(expectedModuleState);
    console.log(currentModuleState.value);

    expect(mockModuleDataService.updateModuleState).toHaveBeenCalled();
    expect(currentModuleState.value).toEqual(expectedModuleState);
  });
});

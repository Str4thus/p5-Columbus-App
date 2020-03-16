import { TestBed } from '@angular/core/testing';

import { CameraControllerService } from './camera-controller.service';
import { ModuleDataService } from '../../module-data/module-data.service';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';
import { ColumbusModuleType } from 'src/columbus/util/Enums';
import { createMockModuleDataService } from 'src/columbus/mocking/Mocks.spec';


describe('CameraControllerService', () => {
  let service: CameraControllerService;
  let cameraModule: ColumbusModule;
  let mockModuleDataService;

  beforeEach(() => {
    // Data
    cameraModule = new ColumbusModule(ColumbusModuleType.CAMERA);

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
    service = TestBed.get(CameraControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it("is responsible for module type CAMERA", () => {
    expect(service._responsibleForModuleType).toEqual(ColumbusModuleType.CAMERA);
  });

  describe("Module Connectivity", () => {
    it("becomes able to operate if the camera module connects", () => {
      expect(service._canOperate.value).toBeFalsy();
      service._subscribeCallback(cameraModule);
      expect(service._canOperate.value).toBeTruthy();
    });

    
    it("becomes unable to operate if the camera module connects", () => {
      expect(service._canOperate.value).toBeFalsy();
      service._subscribeCallback(cameraModule);
      expect(service._canOperate.value).toBeTruthy();
      service._subscribeCallback(null);
      expect(service._canOperate.value).toBeFalsy();
    });
  });

  describe("Module Functionality", () => {
    it("can rotate horizontally", () => {
      service._subscribeCallback(cameraModule); // connect camera module

      expect(service.rotateHorizontally(90)).toBeTruthy();
    });

    it("can rotate vertically", () => {
      service._subscribeCallback(cameraModule); // connect camera module

      expect(service.rotateVertically(90)).toBeTruthy();
    });
  });
});
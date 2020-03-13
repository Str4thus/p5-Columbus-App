import { TestBed } from '@angular/core/testing';

import { ModuleDataService } from './module-data.service';
import { SocketService } from '../socket/socket.service';
import { ColumbusCommand } from 'src/columbus/data-models/ColumbusCommand';
import { OpCode, ColumbusModuleType } from 'src/columbus/util/Enums';
import { ColumbusModule, ColumbusModuleState } from 'src/columbus/data-models/module-data/ColumbusModule';

describe('ModuleDataService', () => {
  let service: ModuleDataService;
  let mockSocketService: SocketService;

  beforeEach(() => {
    // Mocks
    mockSocketService = jasmine.createSpyObj("mockSocketService", ["sendCommand"]);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: SocketService,
          useValue: mockSocketService,
        }
      ]
    })

    // Service
    service = TestBed.get(ModuleDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should init correctly from data', () => {
      let camModule = new ColumbusModule(ColumbusModuleType.CAMERA);
      let engineModule = new ColumbusModule(ColumbusModuleType.ENGINE, { "is_on": true });

      service.init(camModule, engineModule);

      expect(service.numberOfConnectedModules()).toBe(2);
      expect(service.getModuleState(ColumbusModuleType.CAMERA)).toBeDefined();
      expect(service.getModuleState(ColumbusModuleType.ENGINE).value["is_on"]).toBeDefined();
    });

    it('should init correctly without data', () => {
      service.init();

      expect(service.numberOfConnectedModules()).toBe(0);
      expect(service.getModuleState(ColumbusModuleType.CAMERA)).toBe(null);
    });

    it('should skip duplicates moduletypes', () => {
      let camModule1 = new ColumbusModule(ColumbusModuleType.CAMERA);
      let camModule2 = new ColumbusModule(ColumbusModuleType.CAMERA);
      let engineModule1 = new ColumbusModule(ColumbusModuleType.ENGINE);
      let engineModule2 = new ColumbusModule(ColumbusModuleType.ENGINE, { "is_on": true });

      service.init(camModule1, camModule2, engineModule1, engineModule2);

      expect(service.numberOfConnectedModules()).toBe(2);
    })
  });

  describe('Module Management', () => {
    it('can add new module', () => {
      let module = new ColumbusModule(ColumbusModuleType.CAMERA);

      service.addModule(module);

      expect(service.numberOfConnectedModules()).toBe(1);
    });

    it('cannot add same module twice', () => {
      let module = new ColumbusModule(ColumbusModuleType.CAMERA);

      service.addModule(module);
      service.addModule(module);

      expect(service.numberOfConnectedModules()).toBe(1);
    });

    it('can remove module', () => {
      let module = new ColumbusModule(ColumbusModuleType.CAMERA);

      service.init(module);
      service.removeModule(ColumbusModuleType.CAMERA);

      expect(service.numberOfConnectedModules()).toBe(0);
    });

    it('cannot remove invalid module', () => {
      let module = new ColumbusModule(ColumbusModuleType.CAMERA);

      service.init(module);
      service.removeModule(ColumbusModuleType.ENGINE);

      expect(service.numberOfConnectedModules()).toBe(1);
    });

    it('counts the correct number of connected modules', () => {
      let module = new ColumbusModule(ColumbusModuleType.CAMERA);

      service.init(module);
      expect(service.numberOfConnectedModules()).toBe(1);

      service.addModule(new ColumbusModule(ColumbusModuleType.ENGINE));
      expect(service.numberOfConnectedModules()).toBe(2);

      service.removeModule(ColumbusModuleType.CAMERA);
      expect(service.numberOfConnectedModules()).toBe(1);
    })

    it('can clear', () => {
      let module1 = new ColumbusModule(ColumbusModuleType.CAMERA);
      let module2 = new ColumbusModule(ColumbusModuleType.ENGINE);
      let module3 = new ColumbusModule(ColumbusModuleType.LIDAR);

      service.init(module1, module2, module3);
      expect(service.numberOfConnectedModules()).toBe(3);

      service.disconnectAllModules();
      expect(service.numberOfConnectedModules()).toBe(0);
    })
  });

  describe('State Management', () => {
    it('updates state of connected module', () => {
      let module = new ColumbusModule(ColumbusModuleType.CAMERA);
      let newState = new ColumbusModuleState({ "updated": true });

      service.init(module);
      expect(service.numberOfConnectedModules()).toBe(1);


      let updatedState = service.getModuleState(ColumbusModuleType.CAMERA).value;
      expect(updatedState["updated"]).toBeFalsy();
      service.updateModuleState(ColumbusModuleType.CAMERA, newState);

      updatedState = service.getModuleState(ColumbusModuleType.CAMERA).value;
      expect(updatedState["updated"]).toBeTruthy();
    });

    it('generates command based on changes made', () => {
      let module = new ColumbusModule(ColumbusModuleType.CAMERA, {"updated": false, "model": 123});
      let newState = new ColumbusModuleState({ "model": 123, "updated": true });

      service.init(module);
      
      let generatedCommand = service.updateModuleState(ColumbusModuleType.CAMERA, newState);
      let expectedCommand = new ColumbusCommand(OpCode.DISPATCH, { "updated": true });

      expect(generatedCommand).toEqual(expectedCommand);
    });

    it('invokes "sendCommand" of SocketService with the generated command', () => {
      let module = new ColumbusModule(ColumbusModuleType.CAMERA);
      let newState = new ColumbusModuleState({ "updated": true });

      service.init(module);
      let generatedCommand = service.updateModuleState(ColumbusModuleType.CAMERA, newState);
      let expectedCommand = new ColumbusCommand(OpCode.DISPATCH, { "updated": true });

      expect(generatedCommand).toEqual(expectedCommand);
      expect(mockSocketService.sendCommand).toHaveBeenCalledTimes(1);
      expect(mockSocketService.sendCommand).toHaveBeenCalledWith(generatedCommand);
    });
  });

});

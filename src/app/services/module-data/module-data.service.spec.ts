import { TestBed } from '@angular/core/testing';

import { ModuleDataService } from './module-data.service';
import { SocketService } from '../socket/socket.service';
import { ColumbusCommand } from 'src/columbus/data-models/command/ColumbusCommand';
import { OpCode, ColumbusModuleType } from 'src/columbus/util/Enums';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';
import { ColumbusModuleState } from 'src/columbus/data-models/modules/ColumbusModuleState';

describe('ModuleDataService', () => {
  let service: ModuleDataService;
  let mockSocketService: SocketService;

  beforeEach(() => {
    // Mocks
    mockSocketService = jasmine.createSpyObj("SocketService", ["sendCommand"]);

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

  describe('Module Management', () => {
    describe('General Management', () => {
      it('counts the correct number of connected modules', () => {
        let module = new ColumbusModule(ColumbusModuleType.TEST);

        service.addModule(module);
        expect(service.numberOfConnectedModules()).toBe(1);

        service.addModule(new ColumbusModule(ColumbusModuleType.ENGINE));
        expect(service.numberOfConnectedModules()).toBe(2);

        service.removeModule(ColumbusModuleType.TEST);
        expect(service.numberOfConnectedModules()).toBe(1);
      });

      it('can clear module hashmap', () => {
        let module1 = new ColumbusModule(ColumbusModuleType.TEST);
        let module2 = new ColumbusModule(ColumbusModuleType.ENGINE);
        let module3 = new ColumbusModule(ColumbusModuleType.LIDAR);

        service.addModules(module1, module2, module3);
        expect(service.numberOfConnectedModules()).toBe(3);

        service.disconnectAllModules();
        expect(service.numberOfConnectedModules()).toBe(0);
      });
    });

    describe('Adding Modules', () => {
      it('throws error when "addModules" receives no argument', () => {
        expect(() => service.addModules()).toThrowError("Missing module(s) to add!");
      });

      it('can add multiple states at once', () => {
        let module = new ColumbusModule(ColumbusModuleType.TEST);

        service.addModules(module, module);

        expect(service.numberOfConnectedModules()).toBe(1);
      });

      it('can add new module without predefined state', () => {
        let module = new ColumbusModule(ColumbusModuleType.TEST);

        service.addModule(module);

        expect(service.numberOfConnectedModules()).toBe(1);
      });

      it('can add new module wtih predefined state', () => {
        let module = new ColumbusModule(ColumbusModuleType.TEST, { "updated": false });

        service.addModule(module);

        expect(service.numberOfConnectedModules()).toBe(1);
        expect(service.getModuleState(ColumbusModuleType.TEST).getCurrentState("updated")).toBeFalsy();
      });

      it('cannot add same module type twice', () => {
        let module = new ColumbusModule(ColumbusModuleType.TEST);

        service.addModules(module, module);

        expect(service.numberOfConnectedModules()).toBe(1);
      });
    });

    describe('Getting States', () => {
      it('can get a connected module', () => {
        let module = new ColumbusModule(ColumbusModuleType.TEST);

        service.addModule(module);

        expect(service.getModuleState(ColumbusModuleType.TEST)).toBe(module.state);
      });

      it('gets "null" when the queried module is not connected', () => {
        expect(service.getModuleState(ColumbusModuleType.TEST)).toBe(null);
      });
    })

    describe('Removing States', () => {
      it('can remove module', () => {
        let module = new ColumbusModule(ColumbusModuleType.TEST);

        service.addModule(module);
        service.removeModule(ColumbusModuleType.TEST);

        expect(service.numberOfConnectedModules()).toBe(0);
      });

      it('cannot remove invalid module', () => {
        let module = new ColumbusModule(ColumbusModuleType.TEST);

        service.addModule(module);
        service.removeModule(ColumbusModuleType.ENGINE);

        expect(service.numberOfConnectedModules()).toBe(1);
      });
    });
  });

  describe('State Management', () => {
    it('updates state of connected module', () => {
      let module = new ColumbusModule(ColumbusModuleType.TEST);
      let startStateData = { "updated": true };

      service.addModule(module);
      expect(service.numberOfConnectedModules()).toBe(1);


      service.updateModuleState(ColumbusModuleType.TEST, {"updated": false});
      expect(service.getModuleState(ColumbusModuleType.TEST).getCurrentState("updated")).toBeFalsy();

      
      service.updateModuleState(ColumbusModuleType.TEST, startStateData);
      expect(service.getModuleState(ColumbusModuleType.TEST).getCurrentState("updated")).toBeTruthy();
    });

    it('generates command based on changes made', () => {
      let module = new ColumbusModule(ColumbusModuleType.TEST, { "updated": false, "model": 123 });
      let newStateData = { "model": 123, "updated": true };

      service.addModule(module);

      let generatedCommand = service.updateModuleState(ColumbusModuleType.TEST, newStateData);
      let expectedCommand = new ColumbusCommand(OpCode.DISPATCH, { "updated": true });

      expect(generatedCommand).toEqual(expectedCommand);
    });

    it('invokes "sendCommand" of SocketService with the generated command', () => {
      let module = new ColumbusModule(ColumbusModuleType.TEST);
      let newStateData = { "updated": true };

      service.addModule(module);
      let generatedCommand = service.updateModuleState(ColumbusModuleType.TEST, newStateData);
      let expectedCommand = new ColumbusCommand(OpCode.DISPATCH, { "updated": true });

      expect(generatedCommand).toEqual(expectedCommand);
      expect(mockSocketService.sendCommand).toHaveBeenCalledTimes(1);
      expect(mockSocketService.sendCommand).toHaveBeenCalledWith(generatedCommand);
    });
  });

});

import { TestBed } from '@angular/core/testing';

import { ModuleDataService } from './module-data.service';
import { SocketService } from '../socket/socket.service';
import { ColumbusCommand } from 'src/columbus/data-models/ColumbusCommand';
import { OpCode, ColumbusModuleType } from 'src/columbus/util/Enums';
import { ColumbusModule } from 'src/columbus/data-models/module-data/ColumbusModule';

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
      let initData: Array<ColumbusModule> = new Array();
      initData.push(new ColumbusModule(ColumbusModuleType.CAMERA))
      initData.push(new ColumbusModule(ColumbusModuleType.ENGINE, { "is_on": true }))

      service.init(initData);

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
      let initData: Array<ColumbusModule> = new Array();
      initData.push(new ColumbusModule(ColumbusModuleType.CAMERA))
      initData.push(new ColumbusModule(ColumbusModuleType.CAMERA))
      initData.push(new ColumbusModule(ColumbusModuleType.ENGINE))
      initData.push(new ColumbusModule(ColumbusModuleType.ENGINE, { "is_on": true }))

      service.init(initData);

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

      service.init(new Array(module));
      service.removeModule(ColumbusModuleType.CAMERA);

      expect(service.numberOfConnectedModules()).toBe(0);
    });

    it('cannot remove invalid module', () => {
      let module = new ColumbusModule(ColumbusModuleType.CAMERA);

      service.init(new Array(module));
      service.removeModule(ColumbusModuleType.ENGINE);

      expect(service.numberOfConnectedModules()).toBe(1);
    });

    it('counts the correct number of connected modules', () => {
      let module = new ColumbusModule(ColumbusModuleType.CAMERA);

      service.init(new Array(module));
      expect(service.numberOfConnectedModules()).toBe(1);

      service.addModule(new ColumbusModule(ColumbusModuleType.ENGINE));
      expect(service.numberOfConnectedModules()).toBe(2);

      service.removeModule(ColumbusModuleType.CAMERA);
      expect(service.numberOfConnectedModules()).toBe(1);
    })
  });

  describe('State Management', () => {
  });

});

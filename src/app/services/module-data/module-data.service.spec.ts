import { TestBed } from '@angular/core/testing';

import { ModuleDataService } from './module-data.service';
import { SocketService } from '../socket/socket.service';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';
import { ColumbusModuleType, OpCode } from 'src/columbus/util/Enums';
import { ColumbusCommand } from 'src/columbus/data-models/command/ColumbusCommand';
import { createMockSocketService } from 'src/columbus/mocking/Mocks.spec';

describe('ModuleDataService', () => {
  let testModule: ColumbusModule;
  let service: ModuleDataService;
  let mockSocketService: SocketService;

  beforeEach(() => {
    // Data
    testModule = new ColumbusModule(ColumbusModuleType.TEST);
    
    // Mocks
    mockSocketService = createMockSocketService();
    
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

 
  describe('State Management', () => {
    it('invokes "_generateCommand" on module state change with the updated module', () => {
      spyOn(service, "_generateCommand");

      service.addModule(testModule);
      service.updateState(testModule.type, {"updated": true});

      expect(service._generateCommand).toHaveBeenCalledWith(testModule);
    });

    it('generates the correct command', () => {
      let expectedCommand: ColumbusCommand = new ColumbusCommand(OpCode.DISPATCH, {"updated": true});
      
      service.addModule(testModule);
      service.updateState(testModule.type, {"updated": true});
      let actualCommand = service._generateCommand(testModule);

      expect(expectedCommand).toEqual(actualCommand);
    });

    it('invokes "sendCommand" of SocketService with the generated command', () => {
      service.addModule(testModule);
      service.updateState(testModule.type, {"updated": true});
      
      let generatedCommand = service._generateCommand(testModule);
      expect(mockSocketService.sendCommand).toHaveBeenCalledWith(generatedCommand);
    });
  });

});

import { TestBed } from '@angular/core/testing';

import { ModuleDataService } from './module-data.service';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';
import { ColumbusModuleType, OpCode, ColumbusEventType } from 'src/columbus/data-models/Enums';
import { createMockCommandService } from 'src/columbus/mocking/Mocks.spec';
import { CommandService } from '../command/command.service';

describe('ModuleDataService', () => {
  let testModule: ColumbusModule;
  let service: ModuleDataService;
  let mockCommandService: CommandService;

  beforeEach(() => {
    // Data
    testModule = new ColumbusModule(ColumbusModuleType.TEST);

    // Mocks
    mockCommandService = createMockCommandService();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: CommandService,
          useValue: mockCommandService,
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
    it('invokes "addCommandToQueue" of CommandService with the correct parameters on state update', () => {
      service.addModule(testModule);
      service.updateState(testModule.type, ColumbusEventType.TEST, { "updated": true });

      expect(mockCommandService.addCommandToQueue).toHaveBeenCalledWith(ColumbusEventType.TEST, testModule);
    });
  });

});

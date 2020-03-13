import { TestBed } from '@angular/core/testing';

import { ModuleDataService } from './module-data.service';
import { SocketService } from '../socket/socket.service';
import { ColumbusCommand } from 'src/columbus/data-models/ColumbusCommand';
import { OpCode } from 'src/columbus/util/Enums';

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

  it('requests to send command via SocketService', () => {
    let command = new ColumbusCommand(OpCode.DISPATCH);

    service.requestToSendCommand(command);

    expect(mockSocketService.sendCommand).toHaveBeenCalledTimes(1);
  });
});

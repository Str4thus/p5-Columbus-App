import { TestBed } from '@angular/core/testing';

import { SocketService } from './socket.service';
import { ModuleDataService } from '../module-data/module-data.service';
import { createMockModuleDataService } from 'src/columbus/mocking/Mocks.spec';

describe('SocketService', () => {
  let service: SocketService;
  let mockModuleDataService: ModuleDataService;
  
  beforeEach(() => {
    // Mocks
    mockModuleDataService = createMockModuleDataService();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: ModuleDataService,
          useValue: mockModuleDataService
        }
      ]
    });

    service = TestBed.get(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

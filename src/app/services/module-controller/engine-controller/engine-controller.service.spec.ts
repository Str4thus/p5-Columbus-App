import { TestBed } from '@angular/core/testing';

import { EngineControllerService } from './engine-controller.service';
import { ModuleDataService } from '../../module-data/module-data.service';
import { createMockModuleDataService } from 'src/columbus/mocking/Mocks.spec';


describe('EngineControllerService', () => {
  let service: EngineControllerService;
  let mockModuleDataSerivce;

  beforeEach(() => {
    // Mocks
    mockModuleDataSerivce = createMockModuleDataService();

    // Module
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ModuleDataService,
          useValue: mockModuleDataSerivce,
        }
      ]
    });

    // Service
    service = TestBed.get(EngineControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("Controller Functionality", () => {
    // TODO add tests
  });
});

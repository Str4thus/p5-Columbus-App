import { TestBed } from '@angular/core/testing';

import { ModuleControllerService } from './module-controller.service';
import { IStateData } from 'src/columbus/data-models/modules/concrete-states/IStateData';
import { ModuleDataService } from '../module-data/module-data.service';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';
import { ColumbusModuleType } from 'src/columbus/util/Enums';

/*
class MockControllerService extends ModuleControllerService<IStateData> {
  constructor(mockModuleDataService: ModuleDataService) {
    super(mockModuleDataService, null);
  }

  onStateChange(newState: IStateData) { }
}

describe('AbstractModuleControllerService', () => {
  let mockService: ModuleControllerService<IStateData>;
  let currentModuleState: ColumbusModule;
  let mockModuleDataService;

  const startState: IStateData = {
    vrot: 0,
    hrot: 0
  }

  beforeEach(() => {
    // Data
    currentModuleState = new ColumbusModule(ColumbusModuleType.TEST, startState);

    // Mocks
    mockModuleDataService = createMockModuleDataServiceForControllers();

    // Service
    mockService = new MockControllerService(mockModuleDataService);
  });

  it('should be created', () => {
    expect(mockService).toBeTruthy();
  });

  describe("General", () => {
    it('should have correct controlling module type', () => {
      expect(mockService.controllingModuleType).toEqual(null);
    });
  });

  describe("Updating", () => {
    it('should correctly invoke updateModuleState of ModuleDataService', () => {
      let newStateData: IStateData = {};

      mockService.setStateData(newStateData);

      expect(mockModuleDataService.updateModuleState).toHaveBeenCalledWith(null, newStateData);
    });

    it('should correctly invoke onStateChange when the state changed', () => {
      console.log(mockService);
      mockModuleDataService.foo(mockService);

      spyOn(mockService, "onStateChange");
      let newStateData: IStateData = {"test": true}
      
      mockService.setStateData(newStateData);

      expect(mockModuleDataService.subscribeToModuleChanges).toHaveBeenCalled();
      expect(mockModuleDataService.notifyObservers).toHaveBeenCalledWith(newStateData);
    });
  });
});
*/
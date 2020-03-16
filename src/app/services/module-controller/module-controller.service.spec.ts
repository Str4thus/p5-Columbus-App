import { ModuleControllerService } from './module-controller.service';
import { IStateData } from 'src/columbus/data-models/modules/concrete-states/IStateData';
import { ModuleDataService } from '../module-data/module-data.service';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';
import { ColumbusModuleType } from 'src/columbus/util/Enums';
import { createMockModuleDataService } from 'src/columbus/mocking/Mocks.spec';


class MockControllerService extends ModuleControllerService<IStateData> {
  constructor(mockModuleDataService: ModuleDataService) {
    super(mockModuleDataService, ColumbusModuleType.TEST);
  }

  onStateChange(newState: IStateData) { }
}

describe('AbstractModuleControllerService', () => {
  let mockService: ModuleControllerService<IStateData>;
  let mockModuleDataService;

  beforeEach(() => {
    // Mock
    mockModuleDataService = createMockModuleDataService();
    
    // Service
    mockService = new MockControllerService(mockModuleDataService);
  });

  it('should be created', () => {
    expect(mockService).toBeTruthy();
  });

  describe('General', () => {
    it("canOperate returns correct value", () => {
      expect(mockService.canOperate()).toBeFalsy();

      mockService._canOperate.next(true);
      expect(mockService.canOperate()).toBeTruthy();

      mockService._canOperate.next(false);
      expect(mockService.canOperate()).toBeFalsy();
    });
  });

  describe("Data on creation", () => {
    it("should retrieve state data from ModuleDataService on creation if module is already connected", () => {
      mockModuleDataService.isModulePresent.and.callFake(() => { return true });
      mockModuleDataService.getModuleState.and.callFake(() => { return { "default": true } });
      mockService = new MockControllerService(mockModuleDataService);

      expect(mockService._canOperate.value).toBeTruthy();
      expect(mockModuleDataService.getModuleState).toHaveBeenCalled();
      expect(mockService._moduleStateDataCopy.value).toEqual({ "default": true });
    });

    it("should not get any data on creation if the module is not connected", () => {
      mockModuleDataService.isModulePresent.and.callFake(() => { return false });
      mockService = new MockControllerService(mockModuleDataService);

      expect(mockService._canOperate.value).toBeFalsy();
      expect(mockModuleDataService.getModuleState).not.toHaveBeenCalled();
      expect(mockService._moduleStateDataCopy.value).toEqual({});
    });
  });

  describe("Updating", () => {
    it("should update the state data copy correctly", () => {
      expect(mockService._moduleStateDataCopy.value).toEqual({});
      mockService._updateStateDataCopy({ "default": true });
      expect(mockService._moduleStateDataCopy.value).toEqual({ "default": true });
    });

    it("should update the state data copy on change", () => {
      let registeredCallback: ((updatedModule: ColumbusModule) => void) = null;
      let callbackSpy = jasmine.createSpy("registeredCallback", registeredCallback);
      let testModule: ColumbusModule = new ColumbusModule(ColumbusModuleType.TEST, {"test": true});

      // Mock setup
      mockModuleDataService.subscribeToModule.and.callFake((type, callback: (updatedModule) => void) => {
        registeredCallback = callback;
      });
      mockModuleDataService.addModule.and.callFake((module: ColumbusModule) => {
        callbackSpy(module);
        mockService._moduleStateDataCopy.next(module.getCurrentState());
      })
      mockModuleDataService.updateState.and.callFake((type, newStateData) => {
        callbackSpy(new ColumbusModule(type, newStateData));
        mockService._moduleStateDataCopy.next(newStateData);
      })

      // Create mock service 
      mockService = new MockControllerService(mockModuleDataService);
      
      // Trigger update callback with testmodule and check if the state changes accordingly
      mockModuleDataService.addModule(testModule);
      expect(callbackSpy).toHaveBeenCalledWith(testModule);
      expect(mockService._moduleStateDataCopy.value).toEqual(testModule.getCurrentState());

      // Update the module state to trigger another update callback and create expected new module object
      mockModuleDataService.updateState(ColumbusModuleType.TEST, { "updated": true });
      let expectedModule = new ColumbusModule(ColumbusModuleType.TEST, { "updated": true });
      
      // Trigger update callback with the expected module and check if the state matches
      expect(callbackSpy).toHaveBeenCalledWith(expectedModule);
      expect(mockService._moduleStateDataCopy.value).toEqual(expectedModule.getCurrentState());

      expect(mockModuleDataService.subscribeToModule).toHaveBeenCalled();
      expect(mockModuleDataService.addModule).toHaveBeenCalled();
      expect(mockModuleDataService.updateState).toHaveBeenCalled();
    });

    it('should set own state data copy to "{}" if the module disconnects', () => {
      let testModule = new ColumbusModule(ColumbusModuleType.TEST, {"test": true});
      expect(mockService._moduleStateDataCopy.value).toEqual({});

      mockService._subscribeCallback(testModule);
      expect(mockService._moduleStateDataCopy.value).toEqual(testModule.getCurrentState());

      mockService._subscribeCallback(null);
      expect(mockService._moduleStateDataCopy.value).toEqual({});
    });

    it("should become unable to operate if the module disconnects", () => {
      let testModule = new ColumbusModule(ColumbusModuleType.TEST);
      expect(mockService._canOperate.value).toBeFalsy();

      mockService._subscribeCallback(testModule);
      expect(mockService._canOperate.value).toBeTruthy();

      mockService._subscribeCallback(null);
      expect(mockService._canOperate.value).toBeFalsy();
    });

    it("should not update state multiple times on multiple consecutive module disconnects", () => {
      spyOn(mockService, "_updateStateDataCopy");
      
      mockService._canOperate.next(true);
      mockService._subscribeCallback(null); // module disconnects

      mockService._canOperate.next(false);
      mockService._subscribeCallback(null); // module disconnects again

      expect(mockService._updateStateDataCopy).toHaveBeenCalledTimes(1);
    });
  });

  describe("Manipulating module", () => {
    it("should be able to apply changes to the module", () => {
      mockService._canOperate.next(true);
      expect(mockService._moduleStateDataCopy.value).toEqual({});

      mockService._moduleStateDataCopy.value["hi"] = 0;
      mockService._applyChanges();

      expect(mockService._moduleStateDataCopy.value).toEqual({"hi": 0});
      expect(mockModuleDataService.updateState).toHaveBeenCalled();
    });

    it("is not able to apply changes if the module is not connected", () => {
      mockService._canOperate.next(true);
      mockService.manipulateStateData("hi", true);
      expect(mockModuleDataService.updateState).toHaveBeenCalledTimes(1);

      mockService._canOperate.next(false);
      mockService.manipulateStateData("hi", true);
      expect(mockModuleDataService.updateState).toHaveBeenCalledTimes(1);
    });
  });
});

import { ModuleControllerService } from './module-controller.service';
import { IStateData } from 'src/columbus/data-models/modules/concrete-states/IStateData';
import { ModuleDataService } from '../module-data/module-data.service';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';
import { ColumbusModuleType, ColumbusEventType } from 'src/columbus/data-models/Enums';
import { createMockModuleDataService } from 'src/columbus/mocking/Mocks.spec';


class MockControllerService extends ModuleControllerService<IStateData> {
  constructor(mockModuleDataService: ModuleDataService) {
    super(mockModuleDataService, ColumbusModuleType.TEST);
  }
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

      mockService._canOperate = true;
      expect(mockService.canOperate()).toBeTruthy();

      mockService._canOperate = false;
      expect(mockService.canOperate()).toBeFalsy();
    });
  });

  describe("Data on creation", () => {
    it("should retrieve state data from ModuleDataService on creation if module is already connected", () => {
      mockModuleDataService.isModuleConnected.and.callFake(() => { return true });
      mockModuleDataService.getModuleState.and.callFake(() => { return { "default": true } });
      mockService = new MockControllerService(mockModuleDataService);

      expect(mockService._canOperate).toBeTruthy();
      expect(mockModuleDataService.getModuleState).toHaveBeenCalled();
      expect(mockService._moduleStateDataCopy).toEqual({ "default": true });
    });

    it("should not get any data on creation if the module is not connected", () => {
      mockModuleDataService.isModuleConnected.and.callFake(() => { return false });
      mockService = new MockControllerService(mockModuleDataService);

      expect(mockService._canOperate).toBeFalsy();
      expect(mockModuleDataService.getModuleState).not.toHaveBeenCalled();
      expect(mockService._moduleStateDataCopy).toEqual({});
    });
  });

  describe("Updating", () => {
    it("should update the state data copy correctly", () => {
      expect(mockService._moduleStateDataCopy).toEqual({});
      mockService._updateStateDataCopy({ "default": true });
      expect(mockService._moduleStateDataCopy).toEqual({ "default": true });
    });

    it("should update the state data copy on change", () => {
      let registeredCallback: ((updatedModule: ColumbusModule) => void) = null;
      let callbackSpy = jasmine.createSpy("registeredCallback", registeredCallback);
      let testModule: ColumbusModule = new ColumbusModule(ColumbusModuleType.TEST, { "test": true });

      // Mock setup
      mockModuleDataService.subscribeToModule.and.callFake((type, callback: (updatedModule) => void) => {
        registeredCallback = callback;
      });
      mockModuleDataService.addModule.and.callFake((module: ColumbusModule) => {
        callbackSpy(module);
        mockService._moduleStateDataCopy = module.getCurrentState();
      })
      mockModuleDataService.updateState.and.callFake((type, newStateData) => {
        callbackSpy(new ColumbusModule(type, newStateData));
        mockService._moduleStateDataCopy = newStateData;
      })

      // Create mock service 
      mockService = new MockControllerService(mockModuleDataService);

      // Trigger update callback with testmodule and check if the state changes accordingly
      mockModuleDataService.addModule(testModule);
      expect(callbackSpy).toHaveBeenCalledWith(testModule);
      expect(mockService._moduleStateDataCopy).toEqual(testModule.getCurrentState());

      // Update the module state to trigger another update callback and create expected new module object
      mockModuleDataService.updateState(ColumbusModuleType.TEST, { "updated": true });
      let expectedModule = new ColumbusModule(ColumbusModuleType.TEST, { "updated": true });

      // Trigger update callback with the expected module and check if the state matches
      expect(callbackSpy).toHaveBeenCalledWith(expectedModule);
      expect(mockService._moduleStateDataCopy).toEqual(expectedModule.getCurrentState());

      expect(mockModuleDataService.subscribeToModule).toHaveBeenCalled();
      expect(mockModuleDataService.addModule).toHaveBeenCalled();
      expect(mockModuleDataService.updateState).toHaveBeenCalled();
    });

    it('should set own state data copy to "{}" if the module disconnects', () => {
      let testModule = new ColumbusModule(ColumbusModuleType.TEST, { "test": true });
      expect(mockService._moduleStateDataCopy).toEqual({});

      mockService._subscribeCallback(testModule);
      expect(mockService._moduleStateDataCopy).toEqual(testModule.getCurrentState());

      mockService._subscribeCallback(null);
      expect(mockService._moduleStateDataCopy).toEqual({});
    });

    it("should become unable to operate if the module disconnects", () => {
      let testModule = new ColumbusModule(ColumbusModuleType.TEST);
      expect(mockService._canOperate).toBeFalsy();

      mockService._subscribeCallback(testModule);
      expect(mockService._canOperate).toBeTruthy();

      mockService._subscribeCallback(null);
      expect(mockService._canOperate).toBeFalsy();
    });

    it("should not update state multiple times on multiple consecutive module disconnects", () => {
      spyOn(mockService, "_updateStateDataCopy");

      mockService._canOperate = true;
      mockService._subscribeCallback(null); // module disconnects

      mockService._canOperate = false;
      mockService._subscribeCallback(null); // module disconnects again

      expect(mockService._updateStateDataCopy).toHaveBeenCalledTimes(1);
    });
  });

  describe("Manipulating module", () => {
    it("should be able to apply changes to the module", () => {
      mockService._canOperate = true;
      expect(mockService._moduleStateDataCopy).toEqual({});

      mockService._moduleStateDataCopy["hi"] = 0;
      mockService._applyChanges(ColumbusEventType.TEST);

      expect(mockService._moduleStateDataCopy).toEqual({ "hi": 0 });
      expect(mockModuleDataService.updateState).toHaveBeenCalled();
    });

    it("is not able to apply changes if the module is not connected", () => {
      mockService._canOperate = true;
      mockService.manipulateStateData(ColumbusEventType.TEST, "hi", true);
      expect(mockModuleDataService.updateState).toHaveBeenCalledTimes(1);

      mockService._canOperate = false;
      mockService.manipulateStateData(ColumbusEventType.TEST, "hi", true);
      expect(mockModuleDataService.updateState).toHaveBeenCalledTimes(1);
    });
  });

  describe("Getting State Copy", () => {
    let initlialStateData: IStateData;
    let testModule: ColumbusModule;

    beforeEach(() => {
      initlialStateData = {"updated": false}
      testModule = new ColumbusModule(ColumbusModuleType.TEST, initlialStateData);

      mockService._subscribeCallback(testModule);
    });

    it("can get whole current state", () => {
      expect(mockService.getStateData()).toEqual(initlialStateData);
    });

    it("can get property of current state", () => {
      expect(mockService.getStateData("updated")).toEqual(initlialStateData["updated"]);
    });

    it("returns null if the queried property is not present", () => {
      expect(mockService.getStateData("notPresent")).toEqual(null);
    });
  })
});

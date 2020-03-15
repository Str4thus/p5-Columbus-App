import { ColumbusModuleState } from '../data-models/modules/ColumbusModuleState';


let mockModuleDataSerivceState: ColumbusModuleState;
export function createMockModuleDataServiceForControllers() {
    let mockModuleDataService = jasmine.createSpyObj("mockModuleDataService", ["addModule", "getModuleState", "updateModuleState", "onStateChange"]);
    mockModuleDataSerivceState = new ColumbusModuleState();

    mockModuleDataService.updateModuleState.and.callFake((_, newState) => {
        mockModuleDataSerivceState.next(newState);
    });

    mockModuleDataService.getModuleState.and.callFake(() => {
      return mockModuleDataSerivceState
    });

    return mockModuleDataService;
}
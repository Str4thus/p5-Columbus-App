export function createMockModuleDataService() {
    return jasmine.createSpyObj("moduleDataSerivce", ["addModule", "removeModule", "updateState", "getModuleState", "isModulePresent", "subscribeToModule"]);

}

export function createMockSocketService() {
    return jasmine.createSpyObj("mockSocketService", [""]);
}

export function createMockCommandService() {
    return jasmine.createSpyObj("mockCommandService", ["addCommandToQueue"]);
}
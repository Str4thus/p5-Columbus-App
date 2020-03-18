export function createMockModuleDataService() {
    return jasmine.createSpyObj("moduleDataSerivce", ["addModule", "applyChangesToModuleState", "removeModule", "updateState", "getModuleState", "isModuleConnected", "subscribeToModule"]);
}

export function createMockSocketService() {
    return jasmine.createSpyObj("mockSocketService", [""]);
}

export function createMockCommandService() {
    return jasmine.createSpyObj("mockCommandService", ["addCommandToQueue"]);
}
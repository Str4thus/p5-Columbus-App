export function createMockModuleDataService() {
    return jasmine.createSpyObj("moduleDataSerivce", ["addModule", "applyChangesToModuleState", "removeModule", "updateState", "getModuleState", "clearModules", "isModuleConnected", "subscribeToModule"]);
}

export function createMockSocketService() {
    return jasmine.createSpyObj("mockSocketService", [""]);
}

export function createMockCommandService() {
    return jasmine.createSpyObj("mockCommandService", ["addCommandToQueue", "subscribeToQueue", "getNextCommandInQueue"]);
}

export function createMockSocket() {
    return jasmine.createSpyObj("mockSocket", ["send", "onopen", "onmessage", "onerror", "onclose"]);
}
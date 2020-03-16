
export function createMockModuleDataService() {
    return jasmine.createSpyObj("moduleDataSerivce", ["addModule", "removeModule", "updateState", "getModuleState", "isModulePresent", "subscribeToModule"]);

}

export function createMockSocketService() {
    return jasmine.createSpyObj("SocketService", ["sendCommand"]);
}
export function createMockModuleDataService() {
    return jasmine.createSpyObj("moduleDataSerivce", ["addModule", "applyChangesToModuleState", "removeModule", "updateState", "getModuleState", "isModuleConnected", "subscribeToModule"]);
}

export function createMockSocketService() {
    return jasmine.createSpyObj("mockSocketService", [""]);
}

export function createMockCommandService() {
    return jasmine.createSpyObj("mockCommandService", ["addCommandToQueue", "subscribeToQueue", "getNextCommandInQueue"]);
}

export function createMockSocket() {
    let mockSocket = jasmine.createSpyObj("mockSocket", ["send", "onopen", "onmessage", "onerror", "onclose", "sendFakeMessage", "sendFakeHeartbeat"]);

    mockSocket.sendFakeMessage.and.callFake((msg) => {
        let event = {"data": msg}
        mockSocket.onmessage(event);
    });

    mockSocket.sendFakeHeartbeat.and.callFake(() => {
        console.log("NOT IMPLEMENTED YET!");
    });

    return mockSocket;
}
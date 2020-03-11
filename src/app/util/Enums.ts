export enum OpCode {
    DISPATCH = 0,
    HELLO = 1,
    MODULES_UPDATE = 2,
    HEARTBEAT = 10,
    HEARTBEAT_ACK = 11,
}

export enum EventType {
    ON_MOVE = "move",
}
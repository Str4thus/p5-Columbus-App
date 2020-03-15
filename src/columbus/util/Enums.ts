export enum OpCode {
    DISPATCH = 0,
    HELLO = 1,
    HEARTBEAT = 10,
    HEARTBEAT_ACK = 11,
}

export enum ColumbusModuleType {
    TEST = "--..--.-.-.-",
    CAMERA = "camera",
    LIDAR = "lidar",
    ENGINE = "engine",
}
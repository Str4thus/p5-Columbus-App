export enum OpCode {
    DISPATCH = 0,
    HELLO = 1,
    HEARTBEAT = 10,
    HEARTBEAT_ACK = 11,
}

export enum ColumbusModuleType {
    TEST = "--..--.-.-.-",
    TEST2 = "..--.--...-",

    CAMERA = "camera",
    LIDAR = "lidar",
    ENGINE = "engine",
}

export enum ColumbusEventType {
    TEST,
    CAMERA_MOVE = "cam_move",
  }
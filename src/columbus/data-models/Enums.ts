/**
 * Operation Code for command.
 */
export enum OpCode {
    DISPATCH = 0,
    HELLO = 1,
    HEARTBEAT = 10,
    HEARTBEAT_ACK = 11,
}

/**
 * Type of module.
 */
export enum ColumbusModuleType {
    TEST = "--..--.-.-.-",
    TEST2 = "..--.--...-",

    CAMERA = "camera",
    LIDAR = "lidar",
    ENGINE = "engine",
}

/**
 * Type of event that needs to be provided in the command.
 */
export enum ColumbusEventType {
    TEST,
    CAMERA_MOVE = "cam_move",
  }
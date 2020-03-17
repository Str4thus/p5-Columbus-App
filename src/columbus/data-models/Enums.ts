/**
 * Operation Code for command.
 */
export enum OpCode {
    DISPATCH = 0,
    HELLO = 1,
    MODULES_UPDATE = 2,
    
    HEARTBEAT = 10,
    HEARTBEAT_ACK = 11,
}

/**
 * Type of module.
 */
export enum ColumbusModuleType {
    TEST = "--..--.-.-.-",
    TEST2 = "..--.--...-",

    CAMERA = "cam",
    LIDAR = "lidar",
    ENGINE = "engine",
    VEHICLE = "vehicle",
}

/**
 * Type of event that needs to be provided in the command.
 */
export enum ColumbusEventType {
    TEST,
    MODULE_CONNECTED = "module_connected",
    MODULE_DISCONNECTED = "module_disconnected",

    CAMERA_MOVE = "cam_move",

  }
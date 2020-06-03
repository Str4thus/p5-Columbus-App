import { Injectable, Inject } from '@angular/core';
import { SocketConfiguration, defaultSocketConfiguration } from 'src/columbus/data-models/socket/SocketConfiguration';
import { ModuleDataService } from '../module-data/module-data.service';
import { CommandService } from '../command/command.service';
import { ColumbusCommand } from 'src/columbus/data-models/command/ColumbusCommand';
import { OpCode, ColumbusModuleType } from 'src/columbus/data-models/Enums';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';
import { Utils } from 'src/columbus/util/Utils';

@Injectable({
  providedIn: 'root'
})
/**
 * Manages the communication with the web socket on Columbus.
 */
export class SocketService {
  _socketConfiguration: SocketConfiguration;
  _socket: WebSocket | any = null; /** Can either be a real WebSocket or a mock instance. */
  _isConnected: boolean = false;

  cameraURL = "";

  constructor(private commandService: CommandService, private moduleDataService: ModuleDataService, @Inject("MockSocket") mockSocket) {
    this._initSocket(defaultSocketConfiguration, mockSocket); // mockSocket can be null, thus the socket is not mocked

    this.commandService.subscribeToQueue(() => this._queueUpdateCallback());
  }


  /**
   * Callback that gets invoked when the socket connection is established.
   * @param event event data 
   */
  _onOpenCallback(event) {
    this._isConnected = true;
  }

  /**
   * Callback that gets invoked when the web socket sends a message to us. It handles the different operation codes and extracts the data correctly.
   * Throws an error, if the provided operation code has no mapping in the corresponding enum.
   * @param event event data 
   */
  _onMessageCallback(event) {
    let data = JSON.parse(event.data);
    let opCode = data["op"];

    console.log("-----");
    console.log("Received command: ");
    console.log(data);
    console.log("-----");

    switch (opCode) {
      case OpCode.DISPATCH: // d: {affected_module: "cam", updates: {"vrot": 90, "hrot": 30}}
        let affectedModule = data["d"]["t"];
        let changesToApply = data["d"]["p"];

        this._handleDispatch(affectedModule as ColumbusModuleType, changesToApply);
        break;

      case OpCode.STATE_UPDATE: // d: {"cam": true", "lidar": false", "engine": true}
        let changedModules = data["d"];
        this._handleStateUpdate(changedModules);
        break;

      case OpCode.HEARTBEAT:
        this._handleHeartbeat();
        break;

      default:
        throw new Error("Invalid OpCode!");
    }
  }

  /**
   * Callback that gets invoked when the socket connection runs into an error. Throws the error that occured.
   * @param event event data
   */
  _onErrorCallback(event) {
    console.log(event);
  }

  /**
   * Callback that gets invoked when the socket connection closes. That happens either due to an error or on purpose. It disconnects all modules that are being
   * managed in the ModuleDataService.
   * @param event event data
   */
  _onCloseCallback(event) {
    this._isConnected = false;
    this.moduleDataService.clearModules();
  }

  /**
   * Callback that gets invoked when a new command is being push onto the command stack in CommandService. It automatically tries to send the command via the socket 
   * connection.
   */
  _queueUpdateCallback() {
    let command = this.commandService.getNextCommandInQueue();

    if (command) {
      this.sendCommand(command);
    }
  }


  /**
   * Initializes the web socket instance based on the provided socket configuration. If the mockSocket parameter is NOT null, the mock instance gets used instead.
   * @param configuarion configuration data
   * @param mockSocket mock socket to use (can be null)
   */
  _initSocket(configuarion: SocketConfiguration, mockSocket) {
    this._socketConfiguration = configuarion;
    this._socket = mockSocket ? mockSocket : new WebSocket(this._socketConfiguration.url); // Allow to use a mock socket object for testing purposes

    this.cameraURL = "http://" + this._socketConfiguration._host + ":" + this._socketConfiguration._port + "/cam";

    this._socket.onopen = e => this._onOpenCallback(e);
    this._socket.onmessage = e => this._onMessageCallback(e);
    this._socket.onerror = e => this._onErrorCallback(e);
    this._socket.onclose = e => this._onCloseCallback(e);
  }

  /**
   * Handles a received DISPATCH command. Simply notifies the ModuleDataService with the provided data from the command.
   * @param affectedModule module that gets updated
   * @param changesToApply changes to apply
   */
  _handleDispatch(affectedModule: ColumbusModuleType, changesToApply: {}) {
    this.moduleDataService.applyChangesToModuleState(affectedModule, changesToApply);
  }

  /**
   * Handles a received STATE_UPDATE command. (Dis)connnects modules based on the provided data from the command. Prevents duplicate addition / removal.
   * @param updatedModules module that gets (dis)connected
   */
  _handleStateUpdate(updatedModules: {}) {
    for (let moduleType of Object.keys(updatedModules)) {
      if (Utils.isPartOfEnum(ColumbusModuleType, moduleType)) {
        if (updatedModules[moduleType] && !this.moduleDataService.isModuleConnected(moduleType as ColumbusModuleType)) {
          this.moduleDataService.addModule(new ColumbusModule(moduleType as ColumbusModuleType));
        }

        if (!updatedModules[moduleType] && this.moduleDataService.isModuleConnected(moduleType as ColumbusModuleType)) {
          this.moduleDataService.removeModule(moduleType as ColumbusModuleType);
        }
      }
    }
  }

  /**
   * Handles a received HEARTBEAT command. Sends a HEARTBEAT_ACK command back to the web socket.
   */
  _handleHeartbeat() {
    let heartbeatAckCommand = new ColumbusCommand(OpCode.HEARTBEAT_ACK);
    this.sendCommand(heartbeatAckCommand);
  }

  /**
   * Sends a command to the web socket. It prevents sending the command, if the socket connection is not active.
   * @param command command to send
   */
  sendCommand(command: ColumbusCommand) {
    console.log("-----");
    console.log("Sending command: ");
    console.log(command);
    console.log("-----");

    if (this._isConnected) {
      this._socket.send(command.serialize());
    }
  }

  /**
   * Reinitializes the web socket. Used to change the socket configuration while the app is running.
   * @param configuarion configuration data
   */
  reinit(configuarion: SocketConfiguration) {
    this._socket.close();

    this._initSocket(configuarion, null);
  }
}



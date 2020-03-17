import { Injectable } from '@angular/core';
import { SocketConfiguration, defaultSocketConfiguration } from 'src/columbus/data-models/socket/SocketConfiguration';
import { ModuleDataService } from '../module-data/module-data.service';
import { CommandService } from '../command/command.service';
import { ColumbusCommand } from 'src/columbus/data-models/command/ColumbusCommand';
import { OpCode, ColumbusEventType, ColumbusModuleType } from 'src/columbus/data-models/Enums';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';
import { Utils } from 'src/columbus/util/Utils';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  _socketConfiguration: SocketConfiguration;
  _socket: WebSocket = null;
  _isConnected: boolean = false;

  constructor(private commandService: CommandService, private moduleDataService: ModuleDataService) {
    this._initSocket(defaultSocketConfiguration);

    this.commandService.subscribeToQueue(() => this._queueUpdateCallback());
  }


  // Callbacks
  _onOpenCallback(event) {
    console.log("opened socket");
    this._isConnected = true;
  }

  _onMessageCallback(event) {
    let data = JSON.parse(event.data);
    let command = new ColumbusCommand(data["op"], data["d"]);
    let opCode = command.op;
    let eventType = command.d.t;
    let payload = command.d.p || data["d"];

    console.log("Received");
    console.log(command);

    switch (opCode) {
      case OpCode.DISPATCH: // t: "camera", p: {"vrot": 90, "hrot": 30}
        this._handleDispatch(eventType as ColumbusModuleType, payload);
        break;

      case OpCode.MODULES_UPDATE: // t: MODULE_CONNECTED, p: "camera"
        this._handleModulesUpdate(eventType as ColumbusEventType, payload as ColumbusModuleType);
        break;

      case OpCode.HELLO:
        this._handleHello(payload.modules);
        break;

      case OpCode.HEARTBEAT:
        this._handleHeartbeat();
        break;

      default:
        console.log("Received invalid OpCode");
        break;
    }
  }

  _onErrorCallback(event) {
    console.log("socket error");
    console.log(event);
  }

  _onCloseCallback(event) {
    console.log("closed socket");
    this._isConnected = false;
  }

  _queueUpdateCallback() {
    let command = this.commandService.getNextCommandInQueue();
    this.sendCommand(command);
  }


  // Functionality
  _initSocket(configuarion: SocketConfiguration, mockSocket = null) {
    this._socketConfiguration = configuarion;
    this._socket = mockSocket ? mockSocket : new WebSocket(this._socketConfiguration.url); // Allow to use a mock socket object for testing purposes

    this._socket.onopen = e => this._onOpenCallback(e);
    this._socket.onmessage = e => this._onMessageCallback(e);
    this._socket.onerror = e => this._onErrorCallback(e);
    this._socket.onclose = e => this._onCloseCallback(e);
  }

  _handleDispatch(affectedModule: ColumbusModuleType, changesToApply: {}) {
    this.moduleDataService.applyChangesToModuleState(affectedModule, changesToApply);
  }

  _handleModulesUpdate(eventType: ColumbusEventType, moduleType: ColumbusModuleType) {
    if (eventType == ColumbusEventType.MODULE_CONNECTED) {
      this.moduleDataService.addModule(new ColumbusModule(moduleType));
    } else if (eventType == ColumbusEventType.MODULE_DISCONNECTED) {
      this.moduleDataService.removeModule(moduleType);
    }
  }

  _handleHello(connectedModules: []) {
    for (let moduleType of connectedModules) {
      if (Utils.isPartOfEnum(ColumbusModuleType, moduleType)) {
        this.moduleDataService.addModule(moduleType);
      }
    }
  }

  _handleHeartbeat() {
    let heartbeatAckCommand = new ColumbusCommand(OpCode.HEARTBEAT_ACK);
    this.sendCommand(heartbeatAckCommand);
  }

  sendCommand(command: ColumbusCommand) {
    if (this._isConnected) {
      console.log("Sent");
      console.log(command);
      this._socket.send(command.serialize());
    }
  }
}



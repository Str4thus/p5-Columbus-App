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
export class SocketService {
  _socketConfiguration: SocketConfiguration;
  _socket: WebSocket | any = null;
  _isConnected: boolean = false;

  constructor(private commandService: CommandService, private moduleDataService: ModuleDataService, @Inject("MockSocket") mockService) {
    this._initSocket(defaultSocketConfiguration, mockService);

    this.commandService.subscribeToQueue(() => this._queueUpdateCallback());
  }


  // Callbacks
  _onOpenCallback(event) {
    this._isConnected = true;
  }

  _onMessageCallback(event) {
    let data = JSON.parse(event.data);
    let opCode = data["op"];

    switch (opCode) {
      case OpCode.DISPATCH: // t: "camera", p: {"vrot": 90, "hrot": 30}
        let affectedModule = data["d"]["affected_module"];
        let changesToApply = data["d"]["updates"];

        this._handleDispatch(affectedModule as ColumbusModuleType, changesToApply);
        break;

      case OpCode.STATE_UPDATE: // t: MODULE_CONNECTED, p: "camera"
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

  _onErrorCallback(event) {
    console.log("socket error");
    console.log(event);
  }

  _onCloseCallback(event) {
    this._isConnected = false;
  }

  _queueUpdateCallback() {
    let command = this.commandService.getNextCommandInQueue();

    if (command) {
      this.sendCommand(command);
    }
  }


  // Functionality
  _initSocket(configuarion: SocketConfiguration, mockSocket) {
    this._socketConfiguration = configuarion;
    this._socket = mockSocket ? mockSocket : new WebSocket(this._socketConfiguration.url); // Allow to use a mock socket object for testing purposes

    this._socket.onopen = e => this._onOpenCallback(e);
    this._socket.onmessage = e => this._onMessageCallback(e);
    this._socket.onerror = e => this._onErrorCallback(e);
    this._socket.onclose = e => this._onCloseCallback(e);
  }

  _handleDispatch(affectedModule: ColumbusModuleType, changesToApply: {}) {
    console.log(affectedModule);
    console.log(changesToApply);

    this.moduleDataService.applyChangesToModuleState(affectedModule, changesToApply);
  }

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

  _handleHeartbeat() {
    let heartbeatAckCommand = new ColumbusCommand(OpCode.HEARTBEAT_ACK);
    this.sendCommand(heartbeatAckCommand);
  }

  sendCommand(command: ColumbusCommand) {
    /*
    if (command && command.op != OpCode.HEARTBEAT_ACK) {
      console.log("Sent");
      console.log(command);
    }*/

    if (this._isConnected) {
      this._socket.send(command.serialize());
    }
  }
}



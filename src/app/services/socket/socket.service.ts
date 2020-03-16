import { Injectable } from '@angular/core';
import { SocketConfiguration, defaultSocketConfiguration } from 'src/columbus/data-models/socket/SocketConfiguration';
import { ModuleDataService } from '../module-data/module-data.service';
import { CommandService } from '../command/command.service';

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
    // Manipulate module data with ModuleDataService
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
}



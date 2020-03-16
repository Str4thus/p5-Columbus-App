import { Injectable } from '@angular/core';
import { ColumbusCommand } from 'src/columbus/data-models/command/ColumbusCommand';
import { SocketConfiguration, defaultSocketConfiguration } from 'src/columbus/data-models/socket/SocketConfiguration';
import { ModuleDataService } from '../module-data/module-data.service';
import { CommandService } from '../command/command.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  _commandQueue;
  _socketConfiguration: SocketConfiguration;
  _socket: WebSocket = null;
  _isConnected: boolean = false;

  constructor(private commandService: CommandService, private moduleDataService: ModuleDataService) {
    this._initSocket(defaultSocketConfiguration);
  }


  // Callbacks
  _onOpenCallback(event) {
    this._isConnected = true;
  }

  _onMessageCallback(event) {

  }

  _onErrorCallback(event) {

  }
  
  _onCloseCallback(event) {
    this._isConnected = false;
  }


  // Functionality
  _initSocket(configuarion: SocketConfiguration, mockSocket = null) {
    this._socketConfiguration = configuarion;
    this._socket = mockSocket ? mockSocket : new WebSocket(this._socketConfiguration.url); // Allow to use a mock socket object for testing purposes

    console.log(this._socket);
    
    this._socket.onopen = e => this._onOpenCallback(e);
    this._socket.onmessage = e => this._onMessageCallback(e);
    this._socket.onerror = e => this._onErrorCallback(e);
    this._socket.onclose = e => this._onCloseCallback(e);
  }

}



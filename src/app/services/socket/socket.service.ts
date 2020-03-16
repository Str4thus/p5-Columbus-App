import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ColumbusCommand } from 'src/columbus/data-models/command/ColumbusCommand';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  _commandQueue;
  _socket: WebSocket;

  constructor() {
    this._initSocket();
  }

  _initSocket() {
    console.log(SocketConfiguration.url);
    //this._socket = new WebSocket()
  }

  sendCommand(command: ColumbusCommand): void {
    console.log(command);
  }
}


abstract class SocketConfiguration {
  private static host: string = "localhost"
  private static port: string = "420"


  static url = `ws://${SocketConfiguration.host}:${SocketConfiguration.port}`
}
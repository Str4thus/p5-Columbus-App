import { Injectable } from '@angular/core';
import { SocketConfiguration } from 'src/app/util/SocketConfiguration';

import { IColumbusCommand } from '../../models/IColumbusCommand';
import { OpCode } from 'src/app/util/Enums';
import { BehaviorSubject } from 'rxjs';
import { DataService } from '../data/data.service';
import { IColumbusModule } from 'src/app/models/IColumbusModule';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
  private isConnected: BehaviorSubject<Boolean> = new BehaviorSubject(false);

  constructor(private dataService: DataService) {
    this.initSocket();
  }

  public initSocket(): void {
    this.socket = new WebSocket(SocketConfiguration.defaultURL());
    
    this.socket.onopen = e => this.onOpenCallback(e);
    this.socket.onmessage = e => this.onMessageCallback(e);
    this.socket.onclose = e => this.onCloseCallback(e);
  }

  public dispatchEvent(data: {}): void {
    let command = {op: OpCode.DISPATCH, d: data} as IColumbusCommand;
    this.sendCommand(command);
  }

  //-- Command Utils
  private sendCommand(command: IColumbusCommand): void {
    let commandString = JSON.stringify(command);
    console.log(commandString);

    if (!this.isConnected.value) {
      this.isConnected.subscribe(newVal => {
        if (newVal)
          this.socket.send(commandString);
      })
    } else {
      this.socket.send(commandString);
    }
  }

  private sendHeartbeatACK(): void {  
    let command = {op: OpCode.HEARTBEAT_ACK}; // Confirms keep alive
    this.sendCommand(command);
  }
  //-------------

  //-- Socket Callbacks
  private onOpenCallback(event): void {
    this.isConnected.next(true);
    console.log("Opened");
  }

  private onMessageCallback(event): void {
    let data = JSON.parse(event.data);
    
    switch (data["op"]) {
      case OpCode.HELLO:
        for (let module of data["d"]["modules"]) {
          let modelInfo = {name: module, availableEvents: null} as IColumbusModule; // TODO change later to get all data from ["d"]["modules"]
          this.dataService.addConnectedModule(modelInfo);
        }
        break;

      case OpCode.HEARTBEAT:
        this.sendHeartbeatACK();
        break;
    }
  }

  private onCloseCallback(event): void {
    this.isConnected.next(false);

    if (event.wasClean) {
      console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      console.log('[close] Connection died');
    }
  }
  //---------------
}

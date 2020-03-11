import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { SocketConfiguration } from 'src/app/util/SocketConfiguration';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private socket;

  public initSocket(): void {
    this.socket = socketIo(SocketConfiguration.default())
  }

  public send(message): void {
    this.socket.emit('message', message);
}
}

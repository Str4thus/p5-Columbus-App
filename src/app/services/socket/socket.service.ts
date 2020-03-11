import { Injectable } from '@angular/core';
import { SocketConfiguration } from 'src/app/util/SocketConfiguration';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;

  constructor() {
    this.initSocket();
  }

  public initSocket(): void {
    this.socket = new WebSocket(SocketConfiguration.defaultURL());
    
    this.socket.onopen = e => this.onOpenCallback(e);
    this.socket.onmessage = e => this.onMessageCallback(e);
    this.socket.onclose = e => this.onCloseCallback(e);
    
  }

  private onOpenCallback(event) {
    console.log("Opened");
  }

  private onMessageCallback(event) {
    
    console.log(this.socket);

    let data = JSON.parse(event.data);
    
    switch (data["op"]) {
      case 1:
        console.log("Hello: " + data);
        break;
      case 10:
        console.log("Wanna respond");
        this.socket.send(JSON.stringify({ "op": 11 }));
        break;
    }
  }

  private onCloseCallback(event) {
    if (event.wasClean) {
      alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      alert('[close] Connection died');
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ColumbusCommand } from 'src/columbus/data-models/ColumbusCommand';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  sendCommand(command: ColumbusCommand): void {
    console.log("sendCommand NOT IMPLEMENTED");
  }
}

import { Injectable } from '@angular/core';
import { ColumbusEventType, OpCode } from 'src/columbus/data-models/Enums';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';
import { Utils } from 'src/columbus/util/Utils';
import { ColumbusCommand } from 'src/columbus/data-models/command/ColumbusCommand';

@Injectable({
  providedIn: 'root'
})
export class CommandService {
  _commandQueue: ColumbusCommand[] = [];
  _observers: (() => void)[] = [];
  

  addCommandToQueue(commandEventType: ColumbusEventType, updatedModule: ColumbusModule) {
    let generatedCommand = this._generateCommand(commandEventType, updatedModule);

    this._commandQueue.push(generatedCommand);
    this._notify();
  }

  getNextCommandInQueue(): ColumbusCommand {
    let command = this._commandQueue.shift();
    return command ? command : null;
  }

  subscribeToQueue(observer: (() => void)) {
    this._observers.push(observer);

    this._notify();
  }


  _notify() {
    for (let observer of this._observers) {
      observer();
    }
  }

  _generateCommand(commandEventType: ColumbusEventType, updatedModule: ColumbusModule) {
    let changes = Utils.differenceBetweenObjectsAfterChange(updatedModule.getPreviousState(), updatedModule.getCurrentState());
    let command = new ColumbusCommand(OpCode.DISPATCH, { t: commandEventType, p: changes });

    return command;
  }
}

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
  _observers: ((command: ColumbusCommand) => void)[] = [];
  

  addCommandToQueue(commandEventType: ColumbusEventType, updatedModule: ColumbusModule) {
    let generatedCommand = this._generateCommand(commandEventType, updatedModule);
    
    this._commandQueue.push(generatedCommand);
    this._notify(generatedCommand);
  }

  getNextCommandInQueue(): ColumbusCommand {
    let command = this._commandQueue.shift();
    return command ? command : null;
  }

  subscribeToQueue(observer: ((command: ColumbusCommand) => void)) {
    this._observers.push(observer);
  }


  _notify(command) {
    for (let observer of this._observers) {
      observer(command);
    }
  }

  _generateCommand(commandEventType: ColumbusEventType, updatedModule: ColumbusModule) {
    let changes = Utils.differenceBetweenObjectsAfterChange(updatedModule.getPreviousState(), updatedModule.getCurrentState());
    let command = new ColumbusCommand(OpCode.DISPATCH, { t: commandEventType, p: changes });

    return command;
  }
}

import { Injectable } from '@angular/core';
import { ColumbusEventType, OpCode } from 'src/columbus/data-models/Enums';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';
import { Utils } from 'src/columbus/util/Utils';
import { ColumbusCommand } from 'src/columbus/data-models/command/ColumbusCommand';

@Injectable({
  providedIn: 'root'
})
/**
 * Manages the commands in a queue that should be send to Columbus.
 */
export class CommandService {
  _commandQueue: ColumbusCommand[] = [];
  _observers: (() => void)[] = [];

  /**
   * Interface to queue a command. Automatically generates the command based on the changes of the current and previous state of the provided 'updatedModule'
   * @param commandEventType command type that gets provided later on in the command that gets send to Columbus
   * @param updatedModule module that has been updated
   */
  addCommandToQueue(commandEventType: ColumbusEventType, updatedModule: ColumbusModule): void {
    let generatedCommand = this._generateCommand(commandEventType, updatedModule);

    console.log(generatedCommand);
    
    this._commandQueue.push(generatedCommand);
    this._notify();
  }

  /**
   * Interface to retrieve a command. Returns null if the queue is empty. Command gets removed after retrieving.
   */
  getNextCommandInQueue(): ColumbusCommand {
    let command = this._commandQueue.shift();
    return command ? command : null;
  }

  /**
   * Used to register for notification when a new command gets queued.
   * @param observer callback that gets executed when a new command was added to the queue
   */
  subscribeToQueue(observer: (() => void)): void {
    this._observers.push(observer);

    this._notify();
  }

  /**
   * Notifies registered observers.
   */
  _notify(): void {
    for (let observer of this._observers) {
      observer();
    }
  }

  /**
   * Generates a command for Columbus based on the provided event type and the module, which state has been updated
   * @param commandEventType type of event
   * @param updatedModule module that has been updated
   */
  _generateCommand(commandEventType: ColumbusEventType, updatedModule: ColumbusModule): ColumbusCommand {
    console.log(updatedModule.getPreviousState());
    console.log(updatedModule.getCurrentState());
    
    let changes = Utils.differenceBetweenObjectsAfterChange(updatedModule.getPreviousState(), updatedModule.getCurrentState());
    let command = new ColumbusCommand(OpCode.DISPATCH, { t: commandEventType, p: changes });

    return command;
  }
}

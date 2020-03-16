import { Injectable } from '@angular/core';
import { ModuleDictionary } from 'src/columbus/util/ModuleDictionary';
import { CommandService } from '../command/command.service';

@Injectable({
  providedIn: 'root'
})
/**
 * Manages the module data and fills the command queue of CommandService.
 */
export class ModuleDataService extends ModuleDictionary {

  constructor(private commandService: CommandService) {
    super();
    
    this._onModuleUpdated = (commandEventType, updatedModule) => {
      this.commandService.addCommandToQueue(commandEventType, updatedModule);
    }
  }
}
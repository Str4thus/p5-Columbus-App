import { Injectable } from '@angular/core';
import { OpCode } from 'src/columbus/util/Enums';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';
import { ColumbusCommand } from 'src/columbus/data-models/command/ColumbusCommand';
import { Utils } from 'src/columbus/util/Utils';
import { SocketService } from '../socket/socket.service';
import { ModuleDictionary } from 'src/columbus/util/ModuleDictionary';

@Injectable({
  providedIn: 'root'
})
export class ModuleDataService extends ModuleDictionary {

  constructor(private socketService: SocketService) {
    super();

    this._onModuleUpdated = (updatedModule) => {
      let command = this._generateCommand(updatedModule);
      this._requestToSendCommand(command);
    }
  }

  _generateCommand(updatedModule: ColumbusModule): ColumbusCommand {
    let changes = Utils.differenceBetweenObjectsAfterChange(updatedModule.getPreviousState(), updatedModule.getCurrentState());
    let command = new ColumbusCommand(OpCode.DISPATCH, changes);

    return command;
  }

  _requestToSendCommand(command: ColumbusCommand) {
    this.socketService.sendCommand(command);
  }
}
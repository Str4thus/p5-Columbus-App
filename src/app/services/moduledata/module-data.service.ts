import { Injectable } from '@angular/core';
import { ColumbusModuleType, OpCode } from 'src/columbus/util/Enums';
import { ColumbusModule, ColumbusModuleState } from 'src/columbus/data-models/module-data/ColumbusModule';
import { ColumbusCommand } from 'src/columbus/data-models/ColumbusCommand';
import { Utils } from 'src/columbus/util/Utils';
import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleDataService {
  private connectedModules: ModuleDictionary = new ModuleDictionary();

  constructor(private socketService: SocketService) {}

  init(modules: Array<ColumbusModule>) {
    for (let module of modules) {
      this.addModule(module);
    }
  }

  getModuleState(moduleType: ColumbusModuleType): ColumbusModuleState {
    return this.connectedModules.get(moduleType);
  }

  addModule(module: ColumbusModule) {
    this.connectedModules.put(module);
  }

  removeModule(moduleType: ColumbusModuleType) {
    this.connectedModules.remove(moduleType);
  }

  updateModuleState(moduleType: ColumbusModuleType, moduleState: ColumbusModuleState) {
    this.connectedModules.update(moduleType, moduleState);
  }

  private generateCommand(previousState: ColumbusModuleState, newState: ColumbusModuleState): ColumbusCommand {
    let changes = Utils.differenceBetweenObjects(previousState, newState);
    let command = new ColumbusCommand(OpCode.DISPATCH, changes);

    this.requestToSendCommand(command);
    return command;
  }

  requestToSendCommand(command: ColumbusCommand) {
    this.socketService.sendCommand(command);
  }
}

class ModuleDictionary {
  dict: {};

  get(moduleType: ColumbusModuleType): ColumbusModuleState {
    if (this.dict.hasOwnProperty(moduleType))
      return this.dict[moduleType];
    return null;
  }

  put(module: ColumbusModule) {
    this.dict[module.type] = module.state;
  }

  update(moduleType: ColumbusModuleType, newState: ColumbusModuleState) {
    this.dict[moduleType] = newState;
  }

  remove(moduleType: ColumbusModuleType) {
    delete this.dict[moduleType];
  }

  clear() {
    this.dict = {}
  }
}
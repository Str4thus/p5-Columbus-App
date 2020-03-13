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

  constructor(private socketService: SocketService) { }

  init(...modules: ColumbusModule[]) {
    if (modules.length > 0) {
      modules.forEach(module => {
        this.addModule(module);
      })
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

  updateModuleState(moduleType: ColumbusModuleType, moduleState: ColumbusModuleState): ColumbusCommand {
    let oldState = this.connectedModules.get(moduleType);
    this.connectedModules.update(moduleType, moduleState);

    return this.generateCommand(oldState, moduleState);
  }

  numberOfConnectedModules() {
    return this.connectedModules.length();
  }

  disconnectAllModules() {
    this.connectedModules.clear();
  }

  private generateCommand(previousState: ColumbusModuleState, newState: ColumbusModuleState): ColumbusCommand {
    let changes = Utils.differenceBetweenStates(previousState, newState);
    let command = new ColumbusCommand(OpCode.DISPATCH, changes);

    this.requestToSendCommand(command);
    return command;
  }

  private requestToSendCommand(command: ColumbusCommand) {
    this.socketService.sendCommand(command);
  }
}

class ModuleDictionary {
  dict: {} = {};

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

  length() {
    return Object.keys(this.dict).length;
  }
}
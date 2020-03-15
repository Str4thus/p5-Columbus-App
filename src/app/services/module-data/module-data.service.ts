import { Injectable } from '@angular/core';
import { ColumbusModuleType, OpCode } from 'src/columbus/util/Enums';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';
import { ColumbusCommand } from 'src/columbus/data-models/command/ColumbusCommand';
import { Utils } from 'src/columbus/util/Utils';
import { SocketService } from '../socket/socket.service';
import { ColumbusModuleState } from 'src/columbus/data-models/modules/ColumbusModuleState';
import { IStateData } from 'src/columbus/data-models/modules/concrete-states/IStateData';

@Injectable({
  providedIn: 'root'
})
export class ModuleDataService {
  connectedModules: ModuleDictionary = new ModuleDictionary();
  callback = null;

  constructor(private socketService: SocketService) {}

  getModuleState(moduleType: ColumbusModuleType): ColumbusModuleState {
    return this.connectedModules.get(moduleType);
  }

  isModuleConnected(moduleType: ColumbusModuleType) {
    return this.connectedModules.get(moduleType) != null;
  }

  addModule(module: ColumbusModule) {
    console.log("adding");
    this.connectedModules.put(module);
    
    console.log(this.callback);
    if (this.callback)
      this.callback(module.type, module.state);
  }

  addModules(...modules: ColumbusModule[]) {
    if (modules.length > 0) {
      modules.forEach(module => {
        this.addModule(module);
      });
    } else {
      throw new Error("Missing module(s) to add!");
    }
  }

  wait(callback: (t, s) => void) {
    console.log("wait");
    this.callback = callback;
  }

  removeModule(moduleType: ColumbusModuleType) {
    this.connectedModules.remove(moduleType);
  }

  updateModuleState(moduleType: ColumbusModuleType, newModuleStateData: IStateData): ColumbusCommand {
    let state = this.connectedModules.get(moduleType);
    this.connectedModules.update(moduleType, newModuleStateData);

    return this.generateCommand(state);
  }

  numberOfConnectedModules() {
    return this.connectedModules.length();
  }

  disconnectAllModules() {
    this.connectedModules.clear();
  }

  private generateCommand(moduleState: ColumbusModuleState): ColumbusCommand {
    let changes = Utils.differenceBetweenObjectsAfterChange(moduleState.getPreviousState(), moduleState.getCurrentState());
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

  update(moduleType: ColumbusModuleType, newState: IStateData) {
    this.dict[moduleType].update(newState);
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
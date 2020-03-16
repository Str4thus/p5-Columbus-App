import { ColumbusModuleType, ColumbusEventType } from "../data-models/Enums";
import { ColumbusModule } from '../data-models/modules/ColumbusModule';
import { IStateData } from '../data-models/modules/concrete-states/IStateData';


export class ModuleDictionary {
  // connctedModules[type] = module
  _observers: {} = {};
  protected connectedModules: {} = {};
  protected _onModuleUpdated: (commandEventType, updatedModule) => void = () => {};

  // Base Functionality
  getModule(moduleType: ColumbusModuleType): ColumbusModule {
    if (this.isModulePresent(moduleType)) {
      return this.connectedModules[moduleType];
    }

    return null;
  }

  getModuleState(moduleType: ColumbusModuleType): IStateData {
    let module = this.getModule(moduleType);

    if (module)
      return module.getCurrentState();
    return null;
  }

  addModule(module: ColumbusModule) {
    this.connectedModules[module.type] = module;

    this._notify(module.type);
  }

  updateState(moduleType: ColumbusModuleType, commandEventType: ColumbusEventType, newStateData: IStateData) {
    if (newStateData instanceof ColumbusModule)
      throw new Error("Expected IStateData but got ColumbusModule!");

    let module = this.getModule(moduleType);

    if (module) {
      module.update(newStateData);
      this._notify(moduleType);
      this._onModuleUpdated(commandEventType, module);
    }
  }

  removeModule(moduleType: ColumbusModuleType): boolean {
    if (this.isModulePresent(moduleType)) {
      delete this.connectedModules[moduleType];
      this._notify(moduleType);

      return true;
    }

    return false;
  }

  // Helpers
  isModulePresent(moduleType: ColumbusModuleType) {
    return this.connectedModules[moduleType] != null;
  }

  clearModules() {
    this.connectedModules = {}

    this._notifyAll();
  }

  length() {
    return Object.keys(this.connectedModules).length;
  }

  // Subscription
  subscribeToModule(moduleType: ColumbusModuleType, callback: (observedModule) => void) {
    this._observers[moduleType]
      ? this._observers[moduleType].push(callback)
      : this._observers[moduleType] = [callback];
  }

  _notify(moduleType: ColumbusModuleType) {
    if (this._observers.hasOwnProperty(moduleType)) {
      let observedModule = this.getModule(moduleType);
      for (let observer of this._observers[moduleType]) {
        observer(observedModule);
      }
    }
  }

  _notifyAll() {
    for (let moduleType of Object.keys(this._observers)) {
      this._notify(moduleType as ColumbusModuleType);
    }
  }
}
import { ColumbusModuleType, ColumbusEventType } from "../data-models/Enums";
import { ColumbusModule } from '../data-models/modules/ColumbusModule';
import { IStateData } from '../data-models/modules/concrete-states/IStateData';

/**
 * Base Class for ModuleDataService.
 * 
 * Manages a dictionary of connected modules and notifies observers when changes were made to the dictionary.
 */
export class ModuleDictionary {
  /** connectedModules[ColumbusModuleType] = ColumbusModule */
  protected connectedModules: {} = {};
  
  /** _observers[ColumbusModuleType] = ((observedModule) => void)[] */
  _observers: {} = {};
  _onModuleUpdated: (commandEventType, updatedModule) => void = () => {};

  /**
   * Returns the stored module of the specified type. Returns null if module is not present.
   * @param moduleType type of module to get
   */
  getModule(moduleType: ColumbusModuleType): ColumbusModule {
    if (this.isModuleConnected(moduleType)) {
      return this.connectedModules[moduleType];
    }

    return null;
  }

  /**
   * Returns the state of stored module of the specified type. Returns null if module is not present.
   * @param moduleType type of module to get the state from
   */
  getModuleState(moduleType: ColumbusModuleType): IStateData {
    let module = this.getModule(moduleType);

    if (module)
      return module.getCurrentState();
    return null;
  }

  /**
   * Adds a new module to the connected modules dictionary. Does prevent duplicates with overriding.
   * @param module module to add
   */
  addModule(module: ColumbusModule): void {
    this.connectedModules[module.type] = module;

    this._notify(module.type);
  }

  /**
   * Updates the state of the module of the specified type with the provided new state data. Needs command event type to generate command.
   * @param moduleType type of module to update
   * @param commandEventType type of command that should be executed
   * @param newStateData new module state as object
   */
  updateState(moduleType: ColumbusModuleType, commandEventType: ColumbusEventType, newStateData: IStateData): void {
    if (newStateData instanceof ColumbusModule)
      throw new Error("Expected IStateData but got ColumbusModule!");

    let module = this.getModule(moduleType);

    if (module) {
      module.update(newStateData);
      this._notify(moduleType);
      this._onModuleUpdated(commandEventType, module);
    }
  }

  /**
   * Removes the module of specified type. Returns whether it succeeded.
   * @param moduleType type of module to remove
   */
  removeModule(moduleType: ColumbusModuleType): boolean {
    if (this.isModuleConnected(moduleType)) {
      delete this.connectedModules[moduleType];
      this._notify(moduleType);

      return true;
    }

    return false;
  }

  /**
   * Returns whether the module of specified type is connected.
   * @param moduleType type of module to check presence
   */
  isModuleConnected(moduleType: ColumbusModuleType): boolean {
    return this.connectedModules[moduleType] != null;
  }

  /**
   * Clears dictionary. Notifies all observers with 'null' to show that the module has disconnected.
   */
  clearModules(): void {
    this.connectedModules = {}

    this._notifyAll();
  }

  /**
   * Returns the number of connected modules.
   */
  length(): number {
    return Object.keys(this.connectedModules).length;
  }

  /**
   * Allows to add a callback to the changes of the specified module type
   * @param moduleType type of module
   * @param callback callback that gets executed on changes to the specified type of module
   */
  subscribeToModule(moduleType: ColumbusModuleType, callback: (observedModule) => void): void {
    this._observers[moduleType]
      ? this._observers[moduleType].push(callback)
      : this._observers[moduleType] = [callback];
  }

  /**
   * Notifies all observers of the specified module type.
   * @param moduleType type of module to notify observers
   */
  _notify(moduleType: ColumbusModuleType): void {
    if (this._observers.hasOwnProperty(moduleType)) {
      let observedModule = this.getModule(moduleType);
      for (let observer of this._observers[moduleType]) {
        observer(observedModule);
      }
    }
  }

  /**
   * Notifies all observers of each module type.
   */
  _notifyAll(): void {
    for (let moduleType of Object.keys(this._observers)) {
      this._notify(moduleType as ColumbusModuleType);
    }
  }
}
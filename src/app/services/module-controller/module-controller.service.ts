import { IStateData } from 'src/columbus/data-models/modules/concrete-states/IStateData';
import { ModuleDataService } from '../module-data/module-data.service';
import { ColumbusModuleType, ColumbusEventType } from 'src/columbus/data-models/Enums';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';
import { Utils } from 'src/columbus/util/Utils';

/**
 * Abstract Base Class for all *ModuleControllerServices.
 * 
 * Has a deep copy of the corresponding module state that can be modified and used to update the actual module state later on. 
 */
export abstract class ModuleControllerService<T extends IStateData> {
  _moduleStateDataCopy = {} as T;
  _canOperate: boolean = false; /** Depends on whether the corresponding module is connected */

  constructor(protected moduleDataSerivce: ModuleDataService, public _responsibleForModuleType: ColumbusModuleType) {
    if (this.moduleDataSerivce.isModuleConnected(_responsibleForModuleType)) {
      this._updateStateDataCopy(this.moduleDataSerivce.getModuleState(_responsibleForModuleType));

      this._canOperate = true;
    }

    this.moduleDataSerivce.subscribeToModule(_responsibleForModuleType, (updatedModule) => this._subscribeCallback(updatedModule));
  }

  /**
   * Function that gets invoked when the observed module changes in state.
   * @param updatedModule module that changed in state
   */
  _subscribeCallback(updatedModule: ColumbusModule): void {
    if (updatedModule) {
      this._updateStateDataCopy(updatedModule.getCurrentState());

      if (!this._canOperate) {
        this._canOperate = true;
      }
    } else {
      if (this._canOperate) {
        this._updateStateDataCopy({});
        this._canOperate = false;
      }
    }
  }

  /**
   * Updates the copy of the module state.
   * @param newStateData new state data
   */
  _updateStateDataCopy(newStateData: IStateData): void {
    this._moduleStateDataCopy = Utils.deepClone(newStateData) as T;
  }

  /**
   * Applies the changes that have been made to the internal copy to the actual module state.
   * @param commandEventType event type that gets provided in the command
   */
  _applyChanges(commandEventType: ColumbusEventType): void {
    this.moduleDataSerivce.updateState(this._responsibleForModuleType, commandEventType, this._moduleStateDataCopy);
  }

  /**
   * Whether the controller can operate.
   */
  canOperate(): boolean {
    return this._canOperate;
  }

  /**
   * Interface to make changes to the state data.
   * @param commandEventType command type that gets provided later on in the command that gets send to Columbus
   * @param property property that should get changed
   * @param value new value for the property
   */
  manipulateStateData(commandEventType, property, value): boolean {
    if (this._canOperate) {
      this._moduleStateDataCopy[property] = value;
      this._applyChanges(commandEventType);
      return true;
    }

    return false;
  }

  /**
     * Returns the current state copy. Can specify a desired property of the state to get just that value. 
     * @param prop desired property to get the value of
     */
  getStateData(prop: string = null): T | any {
    if (prop) {
      if (!this._moduleStateDataCopy.hasOwnProperty(prop))
        return null;

      return this._moduleStateDataCopy[prop];
    }

    return this._moduleStateDataCopy;
  }
}

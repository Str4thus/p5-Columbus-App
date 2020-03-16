import { Injectable } from '@angular/core';
import { IStateData } from 'src/columbus/data-models/modules/concrete-states/IStateData';
import { ModuleDataService } from '../module-data/module-data.service';
import { ColumbusModuleType } from 'src/columbus/data-models/Enums';
import { BehaviorSubject } from 'rxjs';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';
import { Utils } from 'src/columbus/util/Utils';

@Injectable({
  providedIn: 'root'
})
export abstract class ModuleControllerService<T extends IStateData> {
  _moduleStateDataCopy: BehaviorSubject<T> = new BehaviorSubject({} as T);
  _canOperate: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(protected moduleDataSerivce: ModuleDataService, public _responsibleForModuleType: ColumbusModuleType) {
    if (this.moduleDataSerivce.isModulePresent(_responsibleForModuleType)) {
      this._updateStateDataCopy(this.moduleDataSerivce.getModuleState(_responsibleForModuleType));

      this._canOperate.next(true);
    }

    this.moduleDataSerivce.subscribeToModule(_responsibleForModuleType, (updatedModule) => this._subscribeCallback(updatedModule));
  }

  _subscribeCallback(updatedModule: ColumbusModule) {
    if (updatedModule) {
      this._updateStateDataCopy(updatedModule.getCurrentState());

      if (!this._canOperate.value) {
        this._canOperate.next(true);
      }
    } else {
      if (this._canOperate.value) {
        this._updateStateDataCopy({});
        this._canOperate.next(false);
      }
    }
  }

  _updateStateDataCopy(newStateData: IStateData) {
    this._moduleStateDataCopy.next(Utils.deepClone(newStateData) as T);
  }

  _applyChanges() {
    this.moduleDataSerivce.updateState(this._responsibleForModuleType, this._moduleStateDataCopy.value);
  }

  canOperate() {
    return this._canOperate.value;
  }

  manipulateStateData(property, value): boolean {
    if (this._canOperate.value) {
      this._moduleStateDataCopy.value[property] = value;
      this._applyChanges();
      return true;
    }

    return false;
  }
}

import { Injectable } from '@angular/core';
import { IStateData } from 'src/columbus/data-models/modules/concrete-states/IStateData';
import { ModuleDataService } from '../module-data/module-data.service';
import { ColumbusModuleType } from 'src/columbus/util/Enums';
import { BehaviorSubject } from 'rxjs';
import { ColumbusModule } from 'src/columbus/data-models/modules/ColumbusModule';
import { Utils } from 'src/columbus/util/Utils';

@Injectable({
  providedIn: 'root'
})
export abstract class ModuleControllerService<T extends IStateData> {
  moduleStateDataCopy: BehaviorSubject<T> = new BehaviorSubject({} as T);
  canOperate: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(protected moduleDataSerivce: ModuleDataService, public responsibleForModuleType: ColumbusModuleType) {
    if (this.moduleDataSerivce.isModulePresent(responsibleForModuleType)) {
      this._updateStateDataCopy(this.moduleDataSerivce.getModuleState(responsibleForModuleType));

      this.canOperate.next(true);
    }

    this.moduleDataSerivce.subscribeToModule(responsibleForModuleType, this._subscribeCallback);
  }

  _subscribeCallback(updatedModule: ColumbusModule) {
    if (updatedModule) {
      this._updateStateDataCopy(updatedModule.getCurrentState());

      if (!this.canOperate.value) {
        this.canOperate.next(true);
      }
    } else {
      if (this.canOperate.value) 
        this.canOperate.next(false);
    }
  }

  _updateStateDataCopy(newStateData: IStateData) {
    this.moduleStateDataCopy.next(Utils.deepClone(newStateData));
  }

  applyChanges() {
    if (this.canOperate.value)
      this.moduleDataSerivce.updateState(this.responsibleForModuleType, this.moduleStateDataCopy.value);
  }
}

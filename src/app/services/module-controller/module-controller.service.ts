import { Injectable } from '@angular/core';
import { ModuleDataService } from '../module-data/module-data.service';
import { IStateData } from 'src/columbus/data-models/modules/concrete-states/IStateData';
import { ColumbusModuleType } from 'src/columbus/util/Enums';
import { Utils } from 'src/columbus/util/Utils';

@Injectable({
  providedIn: 'root'
})
export abstract class ModuleControllerService<T extends IStateData> {
  protected currentStateData: T = {} as T;
  connected = true;

  constructor(protected moduleDataSerivce: ModuleDataService, public controllingModuleType: ColumbusModuleType) {
    if (this.moduleDataSerivce.isModuleConnected(this.controllingModuleType)) {
      this.moduleDataSerivce.getModuleState(this.controllingModuleType).subscribe((newStateData: T) => {
        let copyOfNewStateData = Utils.deepClone(newStateData);

        this.currentStateData = copyOfNewStateData;
        this.onStateChange(copyOfNewStateData);
      });
    } else {
      this.moduleDataSerivce.wait((t, s) => {
        console.log(t);
        console.log(s);
        this.connected = true;
      });

      this.connected = false;
    }
  }


  protected updateModule() {
    if (this.connected)
      this.moduleDataSerivce.updateModuleState(this.controllingModuleType, this.currentStateData);
  }

  setStateData(newStateData: T) {
    this.currentStateData = newStateData;

    this.updateModule();
  }

  abstract onStateChange(newStateData: T);
}

import { Injectable } from '@angular/core';
import { ModuleDataService } from '../module-data/module-data.service';
import { IStateData } from 'src/columbus/data-models/modules/concrete-states/IStateData';
import { ColumbusModuleType } from 'src/columbus/util/Enums';
import { Utils } from 'src/columbus/util/Utils';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class ModuleControllerService<T extends IStateData> {
  protected currentStateData: T = {} as T;
  
  constructor(protected moduleDataSerivce: ModuleDataService, public controllingModuleType: ColumbusModuleType) {
    this.moduleDataSerivce.getModuleState(this.controllingModuleType).subscribe((newStateData: T) => {
      let copyOfNewStateData = Utils.deepClone(newStateData);

      this.currentStateData = copyOfNewStateData;
      this.onStateChange(copyOfNewStateData);
    });
  }


  protected updateModule() {
    this.moduleDataSerivce.updateModuleState(this.controllingModuleType, this.currentStateData);
  }

  setStateData(newStateData: T) {
    this.currentStateData = newStateData;

    this.updateModule();
  }

  abstract onStateChange(newStateData: T);
}

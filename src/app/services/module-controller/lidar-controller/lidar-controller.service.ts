import { Injectable } from '@angular/core';
import { ModuleDataService } from '../../module-data/module-data.service';
import { ColumbusModuleType } from 'src/columbus/util/Enums';
import { IEngineStateData } from 'src/columbus/data-models/modules/concrete-states/IEngineStateData';
import { ModuleControllerService } from '../module-controller.service';

@Injectable({
  providedIn: 'root'
})
export class LidarControllerService extends ModuleControllerService<IEngineStateData> {

  constructor(moduleDataService: ModuleDataService) {
    super(moduleDataService, ColumbusModuleType.LIDAR);
  }

  onStateChange(newStateData: IEngineStateData) {
  }
}

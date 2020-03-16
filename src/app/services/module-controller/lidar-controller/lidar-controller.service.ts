import { Injectable } from '@angular/core';
import { ModuleDataService } from '../../module-data/module-data.service';
import { ColumbusModuleType } from 'src/columbus/data-models/Enums';
import { ModuleControllerService } from '../module-controller.service';
import { ILidarStateData } from 'src/columbus/data-models/modules/concrete-states/ILidarStateData';

@Injectable({
  providedIn: 'root'
})
export class LidarControllerService {

  constructor(moduleDataService: ModuleDataService) {
    //super(moduleDataService, ColumbusModuleType.LIDAR);
  }

  onStateChange(newStateData: ILidarStateData) {
  }
}

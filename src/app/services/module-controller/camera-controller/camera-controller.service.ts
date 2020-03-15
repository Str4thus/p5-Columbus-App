import { Injectable } from '@angular/core';
import { ModuleDataService } from '../../module-data/module-data.service';
import { ColumbusModuleType } from 'src/columbus/util/Enums';
import { ICameraStateData } from 'src/columbus/data-models/modules/concrete-states/ICameraStateData';
import { ModuleControllerService } from '../module-controller.service';

@Injectable({
  providedIn: 'root'
})
export class CameraControllerService extends ModuleControllerService<ICameraStateData> {

  constructor(moduleDataService: ModuleDataService) {
    super(moduleDataService, ColumbusModuleType.TEST);
  }

  onStateChange(newStateData: ICameraStateData) { }

  rotateVertically(deg: number) {
    this.currentStateData.vrot = deg;
    this.updateModule();
  }

  rotateHorizontally(deg: number) {
    this.currentStateData.hrot = deg;
    
    this.updateModule();
  }
}

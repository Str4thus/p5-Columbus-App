import { Injectable } from '@angular/core';
import { ModuleDataService } from '../../module-data/module-data.service';
import { ColumbusModuleType } from 'src/columbus/data-models/Enums';
import { ICameraStateData } from 'src/columbus/data-models/modules/concrete-states/ICameraStateData';
import { ModuleControllerService } from '../module-controller.service';

@Injectable({
  providedIn: 'root'
})
export class CameraControllerService extends ModuleControllerService<ICameraStateData> {

  constructor(moduleDataService: ModuleDataService) {
    super(moduleDataService, ColumbusModuleType.CAMERA);
  }

  rotateHorizontally(deg: number) {
    return this.manipulateStateData("hrot", deg);
  }

  rotateVertically(deg: number): boolean {
    return this.manipulateStateData("vrot", deg);
  }
}

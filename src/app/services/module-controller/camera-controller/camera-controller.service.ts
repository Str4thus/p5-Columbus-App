import { Injectable } from '@angular/core';
import { ModuleDataService } from '../../module-data/module-data.service';
import { ColumbusModuleType, ColumbusEventType } from 'src/columbus/data-models/Enums';
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
    // this.manipulateStateData(EventType.CAMERA_MOVE, "hrot", deg);
    return this.manipulateStateData(ColumbusEventType.CAMERA_MOVE, "hrot", deg);
  }

  rotateVertically(deg: number): boolean {
    return this.manipulateStateData(ColumbusEventType.CAMERA_MOVE, "vrot", deg);
  }
}

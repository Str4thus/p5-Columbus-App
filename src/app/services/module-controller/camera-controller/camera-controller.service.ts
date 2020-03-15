import { Injectable } from '@angular/core';
import { ModuleDataService } from '../../module-data/module-data.service';
import { ColumbusModuleType } from 'src/columbus/util/Enums';
import { ICameraStateData } from 'src/columbus/data-models/modules/concrete-states/ICameraStateData';
import { ModuleControllerService } from '../module-controller.service';

@Injectable({
  providedIn: 'root'
})
export class CameraControllerService  {

  constructor(moduleDataService: ModuleDataService) {
  }

  onStateChange(newStateData: ICameraStateData) { }

  rotateVertically(deg: number) {
  }

  rotateHorizontally(deg: number) {
  }
}

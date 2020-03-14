import { Injectable } from '@angular/core';
import { ModuleDataService } from '../../module-data/module-data.service';
import { ColumbusModuleType } from 'src/columbus/util/Enums';
import { ICameraState } from 'src/columbus/data-models/modules/concrete-states/ICameraState';
import { ColumbusModuleState } from 'src/columbus/data-models/modules/ColumbusModuleState';

@Injectable({
  providedIn: 'root'
})
export class CameraControllerService {
  private currentState: ICameraState;

  constructor(private moduleDataSerivce: ModuleDataService) {
    
    moduleDataSerivce.getModuleState(ColumbusModuleType.CAMERA).subscribe((nextState: ICameraState) => {
      this.currentState = nextState;
    });

  }

  turnUp(deg: number) {
    this.currentState.vrot = deg;

    this.updateModule();
  }

  private updateModule() {
    this.moduleDataSerivce.updateModuleState(ColumbusModuleType.CAMERA, new ColumbusModuleState(this.currentState));
  }
}

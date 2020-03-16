import { Injectable } from '@angular/core';
import { ModuleControllerService } from '../module-controller.service';
import { IEngineStateData } from 'src/columbus/data-models/modules/concrete-states/IEngineStateData';
import { ModuleDataService } from '../../module-data/module-data.service';
import { ColumbusModuleType } from 'src/columbus/data-models/Enums';

@Injectable({
  providedIn: 'root'
})
export class EngineControllerService extends ModuleControllerService<IEngineStateData>{

  constructor(moduleDataService: ModuleDataService) {
    super(moduleDataService, ColumbusModuleType.ENGINE);
  }

  // TODO add functionality
}

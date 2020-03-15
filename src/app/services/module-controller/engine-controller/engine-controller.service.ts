import { Injectable } from '@angular/core';
import { ModuleControllerService } from '../module-controller.service';
import { IEngineStateData } from 'src/columbus/data-models/modules/concrete-states/IEngineStateData';
import { ModuleDataService } from '../../module-data/module-data.service';
import { ColumbusModuleType } from 'src/columbus/util/Enums';

@Injectable({
  providedIn: 'root'
})
export class EngineControllerService {
/*
  constructor(moduleDataService: ModuleDataService) {
    super(moduleDataService, ColumbusModuleType.ENGINE);
  }

  onStateChange(newStateData: IEngineStateData) {
  }*/
}

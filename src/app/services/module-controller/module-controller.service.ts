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
  
}

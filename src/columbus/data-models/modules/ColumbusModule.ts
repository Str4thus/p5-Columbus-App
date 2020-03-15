import { ColumbusModuleType } from 'src/columbus/util/Enums';
import { ColumbusModuleState } from './ColumbusModuleState';
import { IStateData } from './concrete-states/IStateData';


interface IColumbusModule {
    type: ColumbusModuleType,
    state: ColumbusModuleState
}

export class ColumbusModule implements IColumbusModule {
    type: ColumbusModuleType;
    state: ColumbusModuleState = new ColumbusModuleState({});

    constructor(type: ColumbusModuleType, state: IStateData = {}) {
        this.type = type;
        this.state = new ColumbusModuleState(state);
    }
}
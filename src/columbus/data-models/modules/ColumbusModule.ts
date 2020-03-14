import { ColumbusModuleType } from 'src/columbus/util/Enums';
import { ColumbusModuleState } from './ColumbusModuleState';


interface IColumbusModule {
    type: ColumbusModuleType,
    state: ColumbusModuleState
}

export class ColumbusModule implements IColumbusModule {
    type: ColumbusModuleType;
    state: ColumbusModuleState = new ColumbusModuleState({});

    constructor(type: ColumbusModuleType, state: {} = {}) {
        this.type = type;
        this.state = new ColumbusModuleState(state);
    }
}
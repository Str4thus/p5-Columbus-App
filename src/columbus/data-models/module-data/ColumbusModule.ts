import { ColumbusModuleType } from 'src/columbus/util/Enums';
import { BehaviorSubject } from 'rxjs';


interface IColumbusModule {
    type: ColumbusModuleType,
    state: ColumbusModuleState
}

export class ColumbusModuleState extends BehaviorSubject<{}> {
    constructor(state: {} = {}) {
        super({});
    }
}

export class ColumbusModule implements IColumbusModule {
    type: ColumbusModuleType;
    state: BehaviorSubject<{}> = new BehaviorSubject({});

    constructor(type: ColumbusModuleType, state: {} = {}) {
        this.type = type;
        this.state = new BehaviorSubject(state);
    }
}
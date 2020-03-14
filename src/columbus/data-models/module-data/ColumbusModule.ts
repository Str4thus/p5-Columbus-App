import { ColumbusModuleType } from 'src/columbus/util/Enums';
import { BehaviorSubject } from 'rxjs';


interface IColumbusModule {
    type: ColumbusModuleType,
    state: ColumbusModuleState
}

export class ColumbusModuleState extends BehaviorSubject<{}> {
    private previousState: {} = {};

    constructor(state: {} = {}) {
        super(state);
    }

    update(newState: ColumbusModuleState) {
        this.previousState = this.value;
        this.next(newState.value);
    }

    getPreviousState() {
        return this.previousState;
    }

    getCurrentState(prop: string = null) {
        if (prop) {
            return this.value[prop];
        }
        return this.value;
    }
}

export class ColumbusModule implements IColumbusModule {
    type: ColumbusModuleType;
    state: ColumbusModuleState = new ColumbusModuleState({});

    constructor(type: ColumbusModuleType, state: {} = {}) {
        this.type = type;
        this.state = new ColumbusModuleState(state);
    }
}
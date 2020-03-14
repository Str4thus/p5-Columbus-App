import { BehaviorSubject } from 'rxjs';

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
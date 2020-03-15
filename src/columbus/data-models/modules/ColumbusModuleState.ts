import { BehaviorSubject } from 'rxjs';
import { IStateData } from './concrete-states/IStateData';
import { Utils } from 'src/columbus/util/Utils';

export class ColumbusModuleState extends BehaviorSubject<{}> {
    private previousState: IStateData = {};

    constructor(state: IStateData = {}) {
        super(state);
    }

    update(newStateData: IStateData) {
        this.previousState = Utils.deepClone(this.value);
        this.next(Utils.deepClone(newStateData));
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
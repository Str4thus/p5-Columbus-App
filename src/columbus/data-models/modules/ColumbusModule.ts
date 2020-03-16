import { ColumbusModuleType } from 'src/columbus/data-models/Enums';
import { IStateData } from './concrete-states/IStateData';
import { Utils } from 'src/columbus/util/Utils';

export class ColumbusModule {
    type: ColumbusModuleType;
    private previousState: IStateData = {};
    private currentState: IStateData;

    constructor(type: ColumbusModuleType, state: IStateData = {}) {
        this.type = type;
        this.currentState = state;
    }

    update(newStateData: IStateData) {
        this.previousState = Utils.deepClone(this.currentState);
        this.currentState = Utils.deepClone(newStateData);
    }

    getPreviousState() {
        return this.previousState;
    }

    getCurrentState(prop: string = null) {
        if (prop) {
            if (!this.currentState.hasOwnProperty(prop))
                return null;

            return this.currentState[prop];
        }
        
        return this.currentState;
    }
}
import { ColumbusModuleType } from 'src/columbus/data-models/Enums';
import { IStateData } from './concrete-states/IStateData';
import { Utils } from 'src/columbus/util/Utils';

/**
 * Stateful.
 * Represents a module that can be connected to Columbus.
 */
export class ColumbusModule {
    type: ColumbusModuleType;
    private previousState: IStateData = {};
    private currentState: IStateData;

    constructor(type: ColumbusModuleType, defaultState: IStateData = {}) {
        this.type = type;
        this.currentState = defaultState;
    }

    /**
     * Updates the state of this module. Saves state before changes to 'previousState'.
     * @param newStateData data that represents the new current state
     */
    update(newStateData: IStateData): void {
        this.previousState = Utils.deepClone(this.currentState);
        this.currentState = Utils.deepClone(newStateData);
    }

    /**
     * Returns the previous state. If no state changes have been made before, it returns {}.
     */
    getPreviousState(): IStateData {
        return this.previousState;
    }

    /**
     * Returns the current state of the module. Can specify a desired property of the state to get just that value. 
     * @param prop desired property to get the value of
     */
    getCurrentState(prop: string = null): IStateData {
        if (prop) {
            if (!this.currentState.hasOwnProperty(prop))
                return null;

            return this.currentState[prop];
        }
        
        return this.currentState;
    }
}
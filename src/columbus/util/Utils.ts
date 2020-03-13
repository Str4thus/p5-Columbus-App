import { ColumbusModuleState } from '../data-models/module-data/ColumbusModule';

export class Utils {
    static differenceBetweenStates(_stateA: ColumbusModuleState, _stateB: ColumbusModuleState): {} {
        let stateA = _stateA.value;
        let stateB = _stateB.value;

        let difference = {}

        for (let propA of Object.keys(stateA)) {
            if (!stateB.hasOwnProperty(propA) || stateA[propA] != stateB[propA])
                difference[propA] = stateA[propA]
        }

        for (let propB of Object.keys(stateB)) {
            if (!stateA.hasOwnProperty(propB) || stateA[propB] != stateB[propB])
                difference[propB] = stateB[propB]
        }
        
        return difference;
    }
}
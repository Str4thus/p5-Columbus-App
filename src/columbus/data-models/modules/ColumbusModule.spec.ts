import { ColumbusModule } from "./ColumbusModule";
import { ColumbusModuleType } from 'src/columbus/util/Enums';
import { ColumbusModuleState } from './ColumbusModuleState';
import { IStateData } from './concrete-states/IStateData';

describe('ColumbusModule', () => {

    describe("Creation", () => {
        it('should be created without state', () => {
            let module = new ColumbusModule(ColumbusModuleType.TEST);

            expect(module).toBeTruthy();
            expect(module.type).toBe(ColumbusModuleType.TEST);
        });

        it('should be created with state', () => {
            let module = new ColumbusModule(ColumbusModuleType.TEST, { "default": true });

            expect(module).toBeTruthy();
            expect(module.type).toBe(ColumbusModuleType.TEST);
            expect(module.state.value["default"]).toBeTruthy();
        });
    });

    describe("Usage", () => {
        it('should be able to subscribe to state and receive new state on change', () => {
            let module = new ColumbusModule(ColumbusModuleType.TEST);
            let newStateData: IStateData = {}; // Initial value for the BehaviourSubject is '{}', so the newState is initially '{}' as well to prevent errors during assertions

            module.state.subscribe(val => {
                expect(val).toEqual(newStateData);
            });
            
            newStateData = {"changed": true};
            module.state.update(newStateData);
            
            newStateData = {"changed": false};
            module.state.update(newStateData);
        });
    });
});


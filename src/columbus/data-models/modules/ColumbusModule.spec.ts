import { ColumbusModule } from "./ColumbusModule";
import { ColumbusModuleType } from 'src/columbus/util/Enums';
import { ColumbusModuleState } from './ColumbusModuleState';

describe('ColumbusModule', () => {

    describe("Creation", () => {
        it('should be created without state', () => {
            let module = new ColumbusModule(ColumbusModuleType.CAMERA);

            expect(module).toBeTruthy();
            expect(module.type).toBe(ColumbusModuleType.CAMERA);
        });

        it('should be created with state', () => {
            let module = new ColumbusModule(ColumbusModuleType.CAMERA, { "default": true });

            expect(module).toBeTruthy();
            expect(module.type).toBe(ColumbusModuleType.CAMERA);
            expect(module.state.value["default"]).toBeTruthy();
        });
    });

    describe("Usage", () => {
        it('should be able to subscribe to state and receive new state on change', () => {
            let module = new ColumbusModule(ColumbusModuleType.CAMERA);
            let newState = new ColumbusModuleState({}); // Initial value for the BehaviourSubject is '{}', so the newState is initially '{}' as well to prevent errors during assertions

            module.state.subscribe(val => {
                expect(val).toEqual(newState.value);
            });
            
            newState = new ColumbusModuleState({"changed": true});
            module.state.update(newState);
            
            newState = new ColumbusModuleState({"changed": false});
            module.state.update(newState);
        });
    });
});


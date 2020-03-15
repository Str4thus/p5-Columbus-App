import { ColumbusModuleState } from "./ColumbusModuleState";

describe('ColumbusModuleState', () => {

    describe("Creation", () => {
        it('should be created without default state', () => {
            let state = new ColumbusModuleState();

            expect(state).toBeTruthy();
        });

        it('should be created with default state', () => {
            let state = new ColumbusModuleState({ "default": true });

            expect(state).toBeTruthy();
            expect(state.value["default"]).toBeTruthy();
        });
    });

    describe("Updating", () => {
        it("should have different references for previousState and currentState", () => {
            let initlialStateData = { "updated": false };
            let newStateData = { "updated": true };
            
            let moduleState = new ColumbusModuleState(initlialStateData);
            moduleState.update(newStateData);

            expect(moduleState.getPreviousState()).toEqual(initlialStateData);
            expect(moduleState.getCurrentState()).toEqual(newStateData);
            expect(moduleState.getCurrentState()).not.toEqual(moduleState.getPreviousState());
        });
    });
});
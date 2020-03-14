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
});
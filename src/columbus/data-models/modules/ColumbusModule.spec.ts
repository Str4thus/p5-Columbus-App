import { ColumbusModule } from "./ColumbusModule";
import { ColumbusModuleType } from 'src/columbus/data-models/Enums';
import { IStateData } from './concrete-states/IStateData';

describe('ColumbusModule', () => {
    let testModule: ColumbusModule;
    let initlialStateData: IStateData;
    let updatedStateData: IStateData;

    beforeEach(() => {
        initlialStateData = {"updated": false};
        updatedStateData = {"updated": true};
        testModule = new ColumbusModule(ColumbusModuleType.TEST, initlialStateData);
    });

    it("should have different references for previousState and currentState", () => {
        testModule.update(updatedStateData);

        expect(testModule.getPreviousState()).toEqual(initlialStateData);
        expect(testModule.getCurrentState()).toEqual(updatedStateData);
        expect(testModule.getCurrentState()).not.toEqual(testModule.getPreviousState());
    });

    describe("Creation", () => {
        it('should be created without default state', () => {
            let moduleWithoutDefaultState = new ColumbusModule(ColumbusModuleType.TEST);

            expect(moduleWithoutDefaultState).toBeTruthy();
        });

        it('should be created with default state', () => {
            let moduleWithDefaultState = new ColumbusModule(ColumbusModuleType.TEST, {"default": true});

            expect(moduleWithDefaultState).toBeTruthy();
            expect(moduleWithDefaultState.getCurrentState("default")).toBeTruthy();
        });
    });

    describe("Getting States", () => {
        describe("getCurrentState", () => {
            it("can get whole current state", () => {
                expect(testModule.getCurrentState()).toEqual(initlialStateData);
            });

            it("can get property of current state", () => {
                expect(testModule.getCurrentState("updated")).toEqual(initlialStateData["updated"]);
            });

            it("returns null if the queried property is not present", () => {
                expect(testModule.getCurrentState("notPresent")).toEqual(null);
            });
        });

        describe("getPreviousState", () => {
            it("returns { } if the state hasn't been updated before", () => {
                expect(testModule.getPreviousState()).toEqual({});
            });

            it("returns correct previous state", () => {
                testModule.update(updatedStateData);

                expect(testModule.getPreviousState()).toEqual(initlialStateData);
            });
        });
    });

    describe("Updating", () => {
        it("correctly saves new state to currentState", () => {
            testModule.update(updatedStateData);

            expect(testModule.getCurrentState()).toEqual(updatedStateData);
        });
    });
});


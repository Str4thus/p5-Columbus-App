import { Utils } from "./Utils";
import { ColumbusModule } from '../data-models/modules/ColumbusModule';
import { ColumbusModuleType } from './Enums';

describe("Utils", () => {
    describe("differenceBetweenObjectsAfterChange", () => {
        it("detects changes of single property", () => {
            let beforeChanges = { "a": 0 };
            let afterChanges = { "a": 1 };
            let expectedChanges = { "a": 1 };

            let actualChanges = Utils.differenceBetweenObjectsAfterChange(beforeChanges, afterChanges);

            expect(actualChanges).toEqual(expectedChanges);
        });

        it("detects changes of multiple properties", () => {
            let beforeChanges = { "a": 0, "b": 0 };
            let afterChanges = { "a": 1, "b": 3 };
            let expectedChanges = { "a": 1, "b": 3 };

            let actualChanges = Utils.differenceBetweenObjectsAfterChange(beforeChanges, afterChanges);

            expect(actualChanges).toEqual(expectedChanges);
        });

        it("detects changes of property that is an object", () => {
            let beforeChanges = {
                "a": 0,
                "b": 0,
                "test": {
                    "x": false,
                    "y": true
                }
            };

            let afterChanges = {
                "a": 1,
                "test": {
                    "x": true,
                    "y": true
                }
            };

            let expectedChanges = {
                "a": 1,
                "b": null,
                "test": {
                    "x": true
                }
            };

            let actualChanges = Utils.differenceBetweenObjectsAfterChange(beforeChanges, afterChanges);

            expect(actualChanges).toEqual(expectedChanges);
        });

        it("does not detect unchanged properties", () => {
            let beforeChanges = { "a": 0, "b": 0 };
            let afterChanges = { "a": 0, "b": 3 };
            let expectedChanges = { "b": 3 };

            let actualChanges = Utils.differenceBetweenObjectsAfterChange(beforeChanges, afterChanges);

            expect(actualChanges).toEqual(expectedChanges);
        });

        it("can find changes of two columbus state", () => {
            let module = new ColumbusModule(ColumbusModuleType.TEST, { "a": 1, "b": 0, "c": 3 });
            let newStateData = { "a": 0, "b": 0 };
            let expectedChanges = { "a": 0, "c": null }
            module.update(newStateData);

            let actualChanges = Utils.differenceBetweenObjectsAfterChange(module.getPreviousState(), module.getCurrentState());

            expect(actualChanges).toEqual(expectedChanges);
        });
    });

    describe("deepClone", () => {
        it("actually deep clones", () => {
            let a = { "a": 0, "b": { "c": 1 } };
            let b = Utils.deepClone(a);

            a.b.c = 0;

            expect(a.a).toEqual(b.a);
            expect(a.b.c).not.toEqual(b.b.c);
        });
    });
});
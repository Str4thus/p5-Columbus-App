import { Utils } from "../util/Utils";

describe("Utils", () => {
    describe("differenceBetweenObjectsAfterChange", () => {
        it("detects change of single property", () => {
            let beforeChanges = { "a": 0 };
            let afterChanges = { "a": 1 };
            let expectedChanges = { "a": 1 };

            let actualChanges = Utils.differenceBetweenObjectsAfterChange(beforeChanges, afterChanges);

            expect(actualChanges).toEqual(expectedChanges);
        });

        it("detects change of multiple properties", () => {
            let beforeChanges = { "a": 0, "b": 0 };
            let afterChanges = { "a": 1, "b": 3 };
            let expectedChanges = { "a": 1, "b": 3 };

            let actualChanges = Utils.differenceBetweenObjectsAfterChange(beforeChanges, afterChanges);

            expect(actualChanges).toEqual(expectedChanges);
        });

        it("detects change of property that is an object", () => {
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
    });
});
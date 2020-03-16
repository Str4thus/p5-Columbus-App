import { ModuleDictionary } from "./ModuleDictionary";
import { ColumbusModule } from '../data-models/modules/ColumbusModule';
import { ColumbusModuleType } from './Enums';

describe("ModuleDictionary", () => {
    let moduleDict: ModuleDictionary;
    let module: ColumbusModule;
    let moduleA: ColumbusModule;
    let moduleB: ColumbusModule;
    

    beforeEach(() => {
        moduleDict = new ModuleDictionary();
        module = new ColumbusModule(ColumbusModuleType.TEST);
        moduleA = new ColumbusModule(ColumbusModuleType.TEST, {"number": 0});
        moduleB = new ColumbusModule(ColumbusModuleType.TEST, {"number": 1});
    });

    it("should be created", () => {
        expect(moduleDict).toBeTruthy();
    });

    describe("Helpers", () => {
        it("returns correct number of modules (length)", () => {
            expect(moduleDict.length()).toBe(0);

            moduleDict.addModule(moduleA)

            expect(moduleDict.length()).toBe(1);
        });

        it("clears correctly", () => {
            moduleDict.addModule(moduleA);
            moduleDict.clearModules();

            expect(moduleDict.length()).toBe(0);
        });

        it("correctly returns whether a module is connected", () => {
            expect(moduleDict.isModulePresent(module.type)).toBeFalsy();

            moduleDict.addModule(module);

            expect(moduleDict.isModulePresent(module.type)).toBeTruthy();
        });
    });

    describe("Base Functionality", () => {
        describe("add", () => {
            it("can add new entry", () => {
                moduleDict.addModule(module);

                expect(moduleDict.length()).toBe(1);
                expect(moduleDict.getModule(module.type)).toBeTruthy();
            });

            it("prevents duplicate entries for one module", () => {
                moduleDict.addModule(moduleA);
                moduleDict.addModule(moduleB);

                expect(moduleDict.length()).toBe(1);
            });

            it("overrides the value if same module type gets added multiple times", () => {
                moduleDict.addModule(moduleA);
                moduleDict.addModule(moduleB);

                expect(moduleDict.getModule(module.type)).toEqual(moduleB);
            });
        });

        describe("getModule", () => {
            it("gets correct module state if present", () => {
                moduleDict.addModule(module);

                expect(moduleDict.getModule(module.type)).toEqual(module);
            });

            it("returns null if module is not present", () => {
                expect(moduleDict.getModule(module.type)).toBeFalsy();
            });
        });

        describe("getModuleState", () => {
            it("returns the correct state", () => {
                moduleDict.addModule(module);

                expect(moduleDict.getModuleState(module.type)).toEqual(module.getCurrentState());
            });

            it("returns null if module is not present", () => {
                expect(moduleDict.getModuleState(module.type)).toBeFalsy();
            });
        });

        describe("updateState", () => {
            it("updates the correct module", () => {
                moduleDict.addModule(moduleA);
                expect(moduleDict.getModuleState(module.type)).toEqual(moduleA.getCurrentState());

                moduleDict.updateState(module.type, moduleB.getCurrentState());
                expect(moduleDict.getModuleState(module.type)).toEqual(moduleB.getCurrentState());
            });

            it("cannot update disconnected module", () => {
                expect(moduleDict.getModuleState(module.type)).toEqual(null);

                moduleDict.updateState(module.type, moduleB.getCurrentState());
                expect(moduleDict.getModuleState(module.type)).toEqual(null);
            });

            it("throws error if a module is passed instead of a new state", () => {
                expect(() => moduleDict.updateState(module.type, module)).toThrowError("Expected IStateData but got ColumbusModule!");
            });
        });

        describe("remove", () => {
            it("removes module corretly", () => {
                moduleDict.addModule(module);
                expect(moduleDict.getModule(module.type)).toEqual(module);

                let didRemove = moduleDict.removeModule(module.type);

                expect(didRemove).toBeTruthy();
                expect(moduleDict.getModule(module.type)).toEqual(null);
            });

            it("cannot remove disconnected module", () => {
                let didRemove = moduleDict.removeModule(module.type);

                expect(didRemove).toBeFalsy();
                expect(moduleDict.getModule(module.type)).toEqual(null);
            });
        });
    });

    describe("Subscription", () => {
        it("creates new list of observers, if module type has no obsevers yet", () => {
            let callback = () => {};

            expect(moduleDict._observers[module.type]).toBeFalsy();
            moduleDict.subscribeToModule(module.type, callback);
            expect(moduleDict._observers[module.type]).toEqual([callback]);
        });

        it("appends observer to the list, if module type already has observers", () => {
            let callback = () => {};

            moduleDict.subscribeToModule(module.type, callback);
            moduleDict.subscribeToModule(module.type, callback);
            expect(moduleDict._observers[module.type]).toEqual([callback, callback]);
        });

        it("notifies registered observers correctly", () => {
            let callbackSpy1 = jasmine.createSpy("callback", () => {});
            let callbackSpy2 = jasmine.createSpy("callback", () => {});
            moduleDict.subscribeToModule(module.type, callbackSpy1);
            moduleDict.subscribeToModule(module.type, callbackSpy2);

            moduleDict.addModule(module);

            expect(callbackSpy1).toHaveBeenCalledWith(module);
            expect(callbackSpy2).toHaveBeenCalledWith(module);
        });

        it("notifyAll uses notify", () => {
            spyOn(moduleDict, "_notify");

            moduleDict.subscribeToModule(module.type, () => {});
            moduleDict._notifyAll();
            
            expect(moduleDict._notify).toHaveBeenCalled();
        });

        it('notifies all callbacks on "clear" with null', () => {
            let callbackSpy1 = jasmine.createSpy("callback", (module) => {});
            let callbackSpy2 = jasmine.createSpy("callback", (module) => {});
            moduleDict.subscribeToModule(ColumbusModuleType.TEST, callbackSpy1);
            moduleDict.subscribeToModule(ColumbusModuleType.TEST2, callbackSpy2);

            moduleDict.clearModules();

            expect(callbackSpy1).toHaveBeenCalledWith(null);
            expect(callbackSpy2).toHaveBeenCalledWith(null);
        });

        it('works without registered observers', () => {
            let callbackSpy1 = jasmine.createSpy("callback", (module) => {});

            moduleDict.subscribeToModule(ColumbusModuleType.TEST2, callbackSpy1); // Subscribe to TEST2
            moduleDict.addModule(new ColumbusModule(ColumbusModuleType.TEST)); // Add TEST1
            
            expect(() => moduleDict._notify(ColumbusModuleType.TEST)).not.toThrow(); // Should not notify TEST2 observer
            expect(callbackSpy1).not.toHaveBeenCalled();
        });
    });
});
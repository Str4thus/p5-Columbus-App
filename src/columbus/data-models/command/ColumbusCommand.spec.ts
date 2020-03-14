import { ColumbusCommand } from "./ColumbusCommand";
import { OpCode } from '../../util/Enums';

describe("ColumbusCommand", () => {
    describe("Creation", () => {
        it("can be created without payload", () => {
            let command = new ColumbusCommand(OpCode.DISPATCH);

            expect(command).toBeTruthy();
            expect(command.op).toEqual(OpCode.DISPATCH);
        });

        it("can be created with payload", () => {
            let payload = { "test": true }
            let command = new ColumbusCommand(OpCode.DISPATCH, payload);

            expect(command).toBeTruthy();
            expect(command.op).toEqual(OpCode.DISPATCH);
            expect(command.d).toEqual(payload);
        });
    });

    describe("Serialization", () => {
        it("serializes the command correctly", () => {
            let payload = { "test": true }
            let command = new ColumbusCommand(OpCode.DISPATCH, payload);
            
            let serializedData = command.serialize();

            expect(serializedData).toEqual(JSON.stringify(command));
        });
    });
})
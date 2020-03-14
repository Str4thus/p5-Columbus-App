import { OpCode } from '../../util/Enums';

interface IColumbusCommand {
    op: OpCode
    d: {}
}

export class ColumbusCommand implements IColumbusCommand {
    op: OpCode;
    d: {};

    constructor(op: OpCode, data: {} = {}) {
        this.op = op;
        this.d = data;
    }

    serialize(): String {
        let commandObj = {
            op: this.op,
            d: this.d
        }

        return JSON.stringify(commandObj);
    }
}
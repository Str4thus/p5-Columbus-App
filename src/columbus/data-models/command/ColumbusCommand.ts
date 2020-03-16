import { OpCode } from '../Enums';

interface IColumbusCommand {
    op: OpCode
    d: {t, p} // t - event type, p - paylaod
}

export class ColumbusCommand implements IColumbusCommand {
    op: OpCode;
    d: {t, p};

    constructor(op: OpCode, data: {t, p} = {t: null, p: null}) {
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
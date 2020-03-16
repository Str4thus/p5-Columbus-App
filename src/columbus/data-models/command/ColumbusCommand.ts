import { OpCode } from '../Enums';

/**
 * Layout for commands that get sent and received. 
 * op - operation code
 * d - data
 *  t - event type
 *  p - payload
*/
interface IColumbusCommand {
    op: OpCode
    d: {t, p}
}

/**
 * Represents a command that gets sent and received.
 */
export class ColumbusCommand implements IColumbusCommand {
    op: OpCode;
    d: {t, p};

    constructor(op: OpCode, data: {t, p} = {t: null, p: null}) {
        this.op = op;
        this.d = data;
    }

    /**
     * Serializes the command to be transmitted over the web socket connection.
     */
    serialize(): String {
        let commandObj = {
            op: this.op,
            d: this.d
        }

        return JSON.stringify(commandObj);
    }
}
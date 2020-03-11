import { OpCode, EventType } from '../util/Enums';

export interface IColumbusCommand {
    op: OpCode;
    d?: IColumbusEvent; // data
}

export interface IColumbusEvent {
    t: EventType;
    p: {};
}
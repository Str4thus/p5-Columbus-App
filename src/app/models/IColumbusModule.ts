import { EventType } from '../util/Enums';

export interface IColumbusModule {
    name: string;
    availableEvents?: EventType[];
}
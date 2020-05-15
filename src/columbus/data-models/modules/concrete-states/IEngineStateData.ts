import { IStateData } from './IStateData';

/** Layout for engine state data */
export interface IEngineStateData extends IStateData {
    movement: [number, number, number, number] // [forward, right, backward, left]
}
import { IStateData } from './IStateData';

/** Layout for camera state data */
export interface ICameraStateData extends IStateData {
    available: boolean,
    vrot: number,
    hrot: number
}
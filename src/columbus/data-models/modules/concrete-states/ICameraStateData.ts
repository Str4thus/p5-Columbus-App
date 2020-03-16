import { IStateData } from './IStateData';

/** Layout for camera state data */
export interface ICameraStateData extends IStateData {
    vrot: number,
    hrot: number
}
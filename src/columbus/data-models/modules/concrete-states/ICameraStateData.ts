import { IStateData } from './IStateData';

/** Layout for camera state data */
export interface ICameraStateData extends IStateData {
    img: string,
    vrot: number,
    hrot: number
}
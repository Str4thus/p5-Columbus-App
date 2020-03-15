import { IStateData } from '../data-models/modules/concrete-states/IStateData';

export class Utils {
    static differenceBetweenObjectsAfterChange(beforeObj: IStateData, afterObj: IStateData): {} {
        let difference = {}

        for (let beforeProp of Object.keys(beforeObj)) {
            if (!afterObj.hasOwnProperty(beforeProp)) {
                difference[beforeProp] = null;
            }
        }

        for (let afterProp of Object.keys(afterObj)) {
            if (!beforeObj.hasOwnProperty(afterProp) || beforeObj[afterProp] != afterObj[afterProp]) {
                let changes = afterObj[afterProp];

                if(typeof afterObj[afterProp] === typeof {}) {
                    changes = this.differenceBetweenObjectsAfterChange(beforeObj[afterProp], afterObj[afterProp]) 
                }

                difference[afterProp] = changes;
            }
        }
        
        return difference;
    }

    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
}
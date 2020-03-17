import { IStateData } from '../data-models/modules/concrete-states/IStateData';

/**
 * Combines general useful utilities.
 */
export class Utils {
    /**
     * Returns the changes of an object between two states as a new object.
     * @param beforeObj Object before changes
     * @param afterObj Object after changes
     */
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

    /**
     * Returns a new object, that can be modified without affecting its original.
     * @param obj Object to deep clone
     */
    static deepClone(obj): any {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Returns whether the provided value is part of the enum.
     * @param enumType enum type
     * @param valueToCheck value, that should be in enum
     */
    static isPartOfEnum(enumType, valueToCheck): boolean {
        return Object.values(enumType).includes(valueToCheck);
    }
}
export class Utils {
    static differenceBetweenObjectsAfterChange(beforeObj: {}, afterObj: {}): {} {
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
}
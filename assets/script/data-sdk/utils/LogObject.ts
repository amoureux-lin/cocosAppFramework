
import { G32Log } from "./G32Log";

export class LogObject {
    constructor() {

    }

    /** print dump */
    public dump() {
        LogObject.dump(this);
    }

    /** print dump */
    public static dump(obj: Object) {
        if (G32Log.DEBUG && obj) {
            G32Log.d(LogObject.dumpStr(obj));
        }
    }

    private static dumpStr(obj: Object): string {
        let buf = "";
        let type;
        for (let key in obj) {
            type = (typeof obj[key]);
            if (type !== 'function') {
                buf += (key + ":" + ((type !== 'object' || key === '__types__') ? obj[key] : LogObject.dumpStr(obj[key])) + "\n");
            }
        }
        return buf;
    }
}

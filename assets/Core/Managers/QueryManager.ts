import { sys } from "cc";
import { logManager } from "./LogManager";
import { StringUtil } from "../Utils/StringUtil";

class QueryManager{
    private _data: any = {};
    /** 浏览器地址栏原始参数 */ 
    public get data(): any {
        return this._data;
    }

    /** 构造函数 */
    constructor() {
        this._data = StringUtil.parseUrl();
        logManager.info(`查询参数:`,this._data)
    }

    /** 单例实例 */
    public static readonly instance: QueryManager = new QueryManager();
}

export const queryManager = QueryManager.instance;
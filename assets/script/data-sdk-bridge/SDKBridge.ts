import DataAPI from "../data-sdk/api/DataApi";
import { Config } from "../data-sdk/config/Config";
import { HttpManager } from "../data-sdk/http/HttpManager";
import { SDKGame } from "./SDKGame";

export class SDKBridge{

    /** 私有构造函数，确保外部无法直接通过new创建实例 */
    private constructor() {}

    /** 单例实例 */
    public static readonly instance: SDKBridge = new SDKBridge();

    //初始化
    public init(){
        let params:any = app.query.data;
       Config.api_url = "http://localhost:3000";
       Config.ws_url  = "wss://dragon-tiger.g32-uat.com";
       HttpManager.instance.betLimitRuleGroupId = params.betLimitRuleGroupId;
       HttpManager.instance.gameRoomId = params.gameRoomId;
       SDKGame.instance.init()
    }

    /**
    * 进入Join游戏
    */
    public joinGame() {
        let params:any = app.query.data;
        DataAPI.joinGame(params.refreshToken)
    }
}

/** 事件管理器实例 */
export const sdkBridge = SDKBridge.instance;

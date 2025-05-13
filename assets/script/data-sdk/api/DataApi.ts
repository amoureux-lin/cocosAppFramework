import { Config } from "../config/Config";
import GameModel from "../http/GameModel";
import { HttpManager } from "../http/HttpManager";
import G32GameManager, { GameProcesser } from "../manager/G32GameManager";
import { Utils } from "../utils/Utils";

export default class DataAPI {
    ////////////////////////////////////////////////////////////////////////////
    // 主动调用
    public static init(config:IConfig, processers:GameProcesser) {
       Config.api_url = config.api_url;
       Config.ws_url  = config.ws_url;
       HttpManager.instance.betLimitRuleGroupId = Utils.getUrlParam("betLimitRuleGroupId");
       HttpManager.instance.gameRoomId = Utils.getUrlParam("gameRoomId");
       G32GameManager.instance.initProcesser(processers);
    }

    /**
    * 进入Join游戏
    * 监听消息：G32Keys.MSG_G32_GAME_JOIN
    * @param token：refeshToken 
    */
    public static joinGame(token: string) {
        G32GameManager.instance.joinGame(token);
    }

    /**
     * 下注回包
     * 消息监听：G32Keys.MSG_G32_GAME_BET
     * @param tmpBetArr
     * @param extra
     */
    public static doBet(tmpBetArr: { gameWagerId: number; chip: number }[], extra:Object) {
        G32GameManager.instance.bet(tmpBetArr, extra);
    }

    /**
     * 取消下注的最后一步
     * 消息监听：G32Keys.MSG_G32_GAME_BET_CANCEL
     */
     public static cancelLastBet() {
        G32GameManager.instance.cancelLastBet();
     }

    /**
     * 获取历史投注记录
     * 消息监听：G32Keys.MSG_G32_HISTORY_LIST
     * @param gameId 
     * @param currentPage 
     */
    public static reqBetHistoryList(gameId: string, currentPage: number) {
        GameModel.reqBetHistoryList(gameId, currentPage);
    }
    ////////////////////////////////////////////////////////////////////////////
    // 监听回调：
	/** 
     * Ws通知：开始开牌 - G32Keys.MSG_G32_GAME_DATA
     * 数据：G32GameManager.instance.gameCardInfo
     * */

	/** 
     * API回调：游戏结果与派彩 - G32Keys.MSG_G32_GAME_RESULT 
     * 数据：G32GameManager.instance.playResultInfo
     * */

	/** 
     * API回调：获取露珠数据 - G32Keys.MSG_G32_GAME_BEAD
     * 数据：G32BeadManager.instance
     * */

     /** 
     * API回调：游戏结果与派彩 - G32Keys.MSG_G32_GAME_BET 
     * 数据：code
     * */
	
	/** 
     * Ws通知：奖池更新 - G32Keys.MSG_G32_GAME_POOL
     * 数据：G32BetManager.instance
     * */
	
	/** 
     * API回调：额度更新 - G32Keys.MSG_G32_GAME_BALANCE
     * 数据：G32UserManager.instance.userBalance
     * */    
}
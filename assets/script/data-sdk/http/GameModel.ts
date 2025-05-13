import { QParam, HttpManager } from "./HttpManager";
import { G32Keys } from "../manager/G32Keys";
import G32GameManager from "../manager/G32GameManager";

/**
 * 请求回调消息key
 */
export enum GameKeys{
    MSG_JOIN_GAME_PARAM = "MSG_JOIN_GAME_PARAM",
    MSG_GET_LIMIT_LIST_PARAM = "MSG_GET_LIMIT_LIST_PARAM",
    MSG_BET_CONFIRMED_PARAM = "MSG_BET_CONFIRMED_PARAM",
    MSG_GAME_BET_PARAM = "MSG_GAME_BET_PARAM",
    MSG_GAME_BET_CANCEL_PARAM = "MSG_GAME_BET_CANCEL_PARAM",
    MSG_GAME_BET_RECORDS = "MSG_GAME_BET_RECORDS",
    MSG_DRAW_LIST_PARAM = "MSG_DRAW_LIST_PARAM",
}

/**
 * 请求调用接口
 */
export default class GameModel {


    /**
     * Join游戏
     * 监听消息：G32Keys.MSG_G32_GAME_JOIN
     * @param token：refeshToken 
     */
    public static joinGame(token: string) {
        let param = new JoinGameParam();
        const queryManager = HttpManager.instance;
        param.refreshToken = token;
        queryManager.requestWithGet(param);
    }

    /**
     * 获取限红列表
     * 数据：GameManager.instance.limitRuleList
     */
    public static getBetLimitRuleList() {
        let param = new GetLimitRuleParam();
        const queryManager = HttpManager.instance;
        queryManager.requestWithGet(param);
    }

    /**
     * 最后投币确认
     * @param paramData 
     */
    public static userBetConfirm(paramData: UserBetReqType & { originalBets: { gameWagerId: number; chip: number }[] }){
        let param = new BetConfirmedParam();
        param.gameRoomId = paramData.gameRoomId;
        param.gameRoundId = paramData.gameRoundId;
        param.betAmount = paramData.betAmount;
        param.currency = paramData.currency;
        param.bets = paramData.bets;
        param.originalBets = paramData.originalBets;
        param.limitRule = paramData.limitRule;
        param.device = paramData.device;
        param.extra = paramData.extra;

        const queryManager = HttpManager.instance;
        queryManager.requestWithPost(param);
    }
    

    /**
     * 获取投注历史
     * @param paramData 
     */
    public static getBetRecords(roomId:string,roundId:string){
        let param = new BetRecordsParam();
        param.gameRoomId = roomId;
        param.gameRoundId = roundId;
        const queryManager = HttpManager.instance;
        queryManager.requestWithGet(param);
    }

    /**
     * 获取缓存指令
     * @param paramData 
     */
    public static getCommandHistory(roomId:string,roundId:string){
        let param = new CommandHistoryParam();
        param.gameRoomId  = roomId;
        param.gameRoundId = roundId;
        const queryManager = HttpManager.instance;
        queryManager.requestWithGet(param);
    }
    
    /**
     * 投币回包
     * @param paramData 
     * 消息监听：MSG_G32_GAME_BET
     */
    public static bet(paramData: UserBetReqType) {
        let param = new GameBetParam();
        param.gameRoomId = paramData.gameRoomId;
        param.gameRoundId = paramData.gameRoundId;
        param.betAmount = paramData.betAmount;
        param.currency = paramData.currency;
        param.bets = paramData.bets;
        param.limitRule = paramData.limitRule;
        param.device = paramData.device;
        param.extra  = paramData.extra;
        const queryManager = HttpManager.instance;
        queryManager.requestWithPost(param);
    }

    /**
     * 投币取消
     * @param paramData 
     * 消息监听：MSG_G32_GAME_BET_CANCEL
     */
    public static betCancel(paramData: UserBetCancelReqType) {
        let param = new BetCancelParam();
        param.gameRoomId = paramData.gameRoomId;
        param.gameRoundId = paramData.gameRoundId;
        param.orderNoList = paramData.orderNoList;
        param.device = paramData.device;
        const queryManager = HttpManager.instance;
        queryManager.requestWithPut(param);
    }

    /**
     * 获取露珠列表数据
     * 监听消息：G32Keys.MSG_G32_GAME_BEAD
     * @param roomId 
     */
    public static reqBeadList(roomId: string) {
        let param = new DrawResultParam();
        param.roomId = roomId;
        const queryManager = HttpManager.instance;
        queryManager.requestWithGet(param);
    }

    /**
     * 获取历史投币记录
     * @param gameId 
     * @param currentPage 
     */
    public static reqBetHistoryList(gameId: string, currentPage: number, betBeginTime?:string, betEndTime?:string) {
        let param = new HistoryListParam();
        param.gameId = gameId;
        param.currentPage = currentPage;
        param.betBeginTime = betBeginTime;
        param.betEndTime = betEndTime;
        const queryManager = HttpManager.instance;
        queryManager.requestWithGet(param);
    }
}

export class JoinGameParam extends QParam {

    refreshToken!:string;

    path(): string {
        return "game/game/join";
    }

    msgKey(): string {
        return GameKeys.MSG_JOIN_GAME_PARAM;
    }

    public getQuery(): string {
        return "";
    }
}

export class GetLimitRuleParam extends QParam {

    path(): string {
        return "game/gameRoom/betLimitRule/list";
    }

    msgKey(): string {
        return GameKeys.MSG_GET_LIMIT_LIST_PARAM;
    }

    public getQuery(): string {
        return "";
    }
}

export class BetConfirmedParam extends QParam {

    gameRoomId!: string;
    gameRoundId!: string;
    betAmount!: number;
    currency!: string;
    bets!: { gameWagerId: number; chip: number }[];
    originalBets!: { gameWagerId: number; chip: number }[];
    limitRule!: { currency: string; minAmount: number; maxAmount: number };
    device!: DeviceInfo;
    extra!:Object;

    path(): string {
        return G32GameManager.instance.gameId + "/bet/confirmed";
    }

    msgKey(): string {
        return GameKeys.MSG_BET_CONFIRMED_PARAM;
    }

    public getQuery(): string {
        return "";
    }
}
/**获取用户对于当前轮次的游戏投注历史 */
export class BetRecordsParam extends QParam {

    gameRoomId!: string;
    gameRoundId!: string;
    
    device!: DeviceInfo;

    path(): string {
        return G32GameManager.instance.gameId +`/bet/records/${this.gameRoomId}/${this.gameRoundId}`;
    }

    msgKey(): string {
        return GameKeys.MSG_GAME_BET_RECORDS;
    }

    public getQuery(): string {
        return "";
    }
}

export class GameBetParam extends QParam {

    gameRoomId!: string;
    gameRoundId!: string;
    betAmount!: number;
    currency!: string;
    bets!: { gameWagerId: number; chip: number }[];
    limitRule!: { currency: string; minAmount: number; maxAmount: number };
    device!: DeviceInfo;
    extra!:Object;

    path(): string {
        return G32GameManager.instance.gameId + "/bet";
    }

    msgKey(): string {
        return GameKeys.MSG_GAME_BET_PARAM;
    }

    public getQuery(): string {
        return "";
    }
}

export class BetCancelParam extends QParam {

    gameRoomId!: string;
    gameRoundId!: string;
    orderNoList: string[];
    device!: DeviceInfo;

    path(): string {
        return G32GameManager.instance.gameId + "/bet/cancel";
    }

    msgKey(): string {
        return GameKeys.MSG_GAME_BET_CANCEL_PARAM;
    }

    public getQuery(): string {
        return "";
    }
}

export class DrawResultParam extends QParam {

    roomId!:string;

    path(): string {
        return G32GameManager.instance.gameId + `/settle/draw/list/${this.roomId}`;
    }

    msgKey(): string {
        return GameKeys.MSG_DRAW_LIST_PARAM;
    }

    public getQuery(): string {
        return "";
    }
}

export class HistoryListParam extends QParam {

    gameId!:string;
    currentPage!:number;
    /** yyyy-mm-dd hh:MM:ss */
    betBeginTime!:string;
    /** yyyy-mm-dd hh:MM:ss */
    betEndTime!:string;

    path(): string {
        return 'game/order/list';
    }

    msgKey(): string {
        return G32Keys.MSG_G32_HISTORY_LIST;
    }

    public getQuery(): string {
        return "";
    }
}

/** 缓存消息 */
export class CommandHistoryParam extends QParam {

    gameRoomId!:string;
    gameRoundId!:string;

    path(): string {
        return G32GameManager.instance.gameId + '/gameCommand/'+this.gameRoomId+'/' + this.gameRoundId;
    }

    msgKey(): string {
        return G32Keys.MSG_G32_COMMAND_HISTORY;
    }

    public getQuery(): string {
        return "";
    }
}

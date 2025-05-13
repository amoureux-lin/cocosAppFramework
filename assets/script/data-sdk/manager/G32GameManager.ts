import { EventProcessor } from "../utils/G32SdkEventProcessor";
import { G32Keys } from "./G32Keys";
import GameModel, { GameKeys } from "../http/GameModel";
import SocketioConnection from "../socketio/SocketioConnection";
import Utc0 from "../utils/NewDate";
import G32BetManager from "./G32BetManager";
import G32UserManager from "./G32UserManager";
import { G32Log } from "../utils/G32Log";
import { HttpRequest } from "../http/HttpRequest";
import { Utils } from "../utils/Utils";
import { HttpManager } from "../http/HttpManager";

export enum WsCommand {
    Chat = "1", // 聊天消息指令
    Bet_Start = "2", // 投币开始指令
    Bet_Stop = "3", // 投币结束指令
    Game_Draw = "4", // 开奖指令
    Draw_Done = "5", // 关局
    Post_Prize_Done = "6", // 派奖完成
    Refund_Done = "7", // 退款完成
    Game_Data = "8", // 推送游戏结果(百家乐发牌，骰宝筛子点数等)
    Change_Shoe = "9", // 换牌靴指令
    Change_Deck = "10", // 改牌指令
    Cancel_Round = "11", // 投币指令
    Bet = "12", // 投币指令
    Kick_Out = "13", // 踢出指令
    Cancel_Bet = "14", // 取消投币指令
    Balance_Update = "16", // 用户账变指令
    Maintain = "24", // 维护指令
    Game_Close = "25", // 关局指令
    Bet_Receipt = "26", // 投注小票指令
    Won_Ranking = "28", // 游戏中奖排名
    Online_User = "31", // 在线人数
}

export enum GameStageType {
    None = -1, // 未开始游戏阶段
    Bet_Start = 1, // 开始投注阶段
    Bet_Stop = 2, // 停止投注阶段
    Draw = 3, // 开奖阶段
    Game_Pause = 4, // 游戏暂停阶段
}

/** 游戏处理器 */
export interface GameProcesser {
    cardProcesser: CardProcesser,
    beadProcesser: BeadProcesser,
    cmdProcesser:  CmdProcesser,
    betConfirmExtra: BetComfirmedExtra,
}

/** 定制协议处理器 */
export interface CmdProcesser {
    cmdLogic(command: string, data: object);
}

/** 最后投币提交时，附带信息 */
export interface BetComfirmedExtra{
    getBetComfirmedExtra():Object;
}

/** 牌值处理器 */
export interface CardProcesser {
    /** 获取牌值 */
    getCardInfo(): any;
    /** 处理开牌 */
    doCards(card: any): any;
    /** 清理牌 */
    cleanCards(): any;
}

/** 结果露珠处理器 */
export interface BeadProcesser {
    /** 清理露珠 */
    clear(...args: any[]): any;

    /**
         * 参见：api/v1/settle/draw/list/
         * @param data 
         * {
                "id": "1106969637068455424",
                "gameRoomId": "1099613405693862912",
                "gameRoundId": "1106969426615059456",
                "payload": {
                    "data": {
                        "raw": {
                            "dragon": [
                                "11:1"
                            ],
                            "tiger": [
                                "3:4"
                            ]
                        },
                        "dragonPoint": 11,
                        "tigerPoint": 3,
                        "cardNum": 2
                    },
                    "result": [
                        32
                    ]
                }
            }
        */
    onBeadList(data: { payload: any }[]): any;

    /** 新增结果 */
    onAddBead(one: any): void;
}

/**
 * 游戏管理器
 */
export default class G32GameManager extends EventProcessor implements ISingleton {

    isResident?: boolean = true;
    static module: string = "【Game管理器】";
    module: string = null!;

    protected static _instance: G32GameManager = null!;
    public static get instance() { return this._instance || (this._instance = new G32GameManager()); }

    init(...args: any[]) {
        let param = Utils.parseUrlParams();
        G32UserManager.instance.sessionId = param[`sessionId`];
        G32UserManager.instance.loginName = param[`loginName`];
    }

    destory(...args: any[]) {
        this.onDestroy();
    }
    //////////////////////////////////////////////////////////////////
    /** 验证token */
    public token = "";

    /**当前限红数据*/
    public limitRule: GameInfo.LimitRule = {
        currency: "PHP",
        maxAmount: 0,
        minAmount: 0,
    };

    /**限注列表*/
    public limitRuleList: GameInfo.LimitRule[] = [];

    /**荷官信息 */
    public anchorInfo: GameInfo.AnchorInfo = {
        name: "",
        homeTown: "",
        birthday: "",
        facebook: "",
        liveCount: 0,
        id: "",
    };
    /**游戏玩法列表 */
    public gameWagerList: GameInfo.GameWagerInfo[] = [];

    /**游戏类别 */
    public category: GameInfo.Category = {
        name: "",
        code: 0,
    };

    /**源列表 */
    public videoList: GameInfo.VideoItem[] = [
        {
            defaultOn: "N",
            resolution: 0,
            sort: 0,
            videoUrl: "",
        },
    ];

    /** 当前轮次信息 */
    public round: GameInfo.RoundInfo = {
        id: "",
        roundNo: "",
    };

    /** 游戏 id */
    public gameId = "";

    /** 房间号 */
    public roomId = "";

    /** 连续多少kickOutLimit局没投注，就踢出 */
    public kickOutLimit = 15;
    //////////////////////////////////////////////////////////////////
    /**
     * 初始化游戏信息
     * @param data
     */
    initGameInfo(data: GameInfoRes) {
        this.limitRule = data.limitRule;
        this.anchorInfo = data.anchor;
        this.category = data.category;
        this.videoList = data.videoList ?? [];
        this.round = data.round;
        this.roomId = data.id;
        this.gameId = data.game.id;
        this.gameWagerList = data.gameWagerList || [];
        G32BetManager.instance.chipList = data.chipList;
        if (this.limitRule.minAmount < G32BetManager.instance.chipList[0].chip) {
            this.limitRule.minAmount = G32BetManager.instance.chipList[0].chip;
        }
    }

    /**
     * 设置游戏轮次
     * @param data
     */
    setRound(data: GameInfo.RoundInfo) {
        this.round.id = data.id;
        this.round.roundNo = data.roundNo;
    }

    /**
     * 设置限红数据
     * @param data
     */
    setLimitRuleList(list: GameInfo.LimitRule[]) {
        this.limitRuleList = list;
    }

    /////////////////////////////////////////////////////////////////
    /** 当前游戏阶段 */
    public gameStage = GameStageType.Game_Pause;

    /**
     * 设置当前游戏阶段
     * @param stage
     */
    setGameStage(stage: GameStageType) {
        this.gameStage = stage;
    }
    /////////////////////////////////////////////////////////////////
    /** 倒计时 */
    public countdown = 0;
    /** 倒计时开始时间 */
    public startTime = 0;
    /** 当前时间 */
    public curTime = 0;
    /** 开牌  派彩 延时 */
    public delay = 0;

    public setCountdown(value: number) {
        this.countdown = value;
    }

    public setStartTime(value: number) {
        this.startTime = value;
    }

    public setCurTime(value: number) {
        this.curTime = value;
    }
    /////////////////////////////////////////////////////////////////
    private processers?: GameProcesser;

    /** 设置处理器 */
    public initProcesser(processers: GameProcesser) {
        this.processers = processers;
    }
    //////////////////////////////////////////////////////////////////
    /** 最终派彩 */
    public lastWin = "";

    /** 游戏玩法结果信息 */
    public playResultInfo: GameResultInfo = {
        isWin: false,
        winner: 1,
        count: 0,
        winArea: [],
    };

    // 中奖的投注区列表
    public winGameWagerList: number[] = [];
    setWinGameWagerList(gameWagers: number[]) {
        this.winGameWagerList = gameWagers;
    }
    /////////////////////////////////////////////////////////////////
    // 当前局中奖排名列表
    public wonRankingList:WonRankType[];

    setWonRankingList(list: WonRankType[]) {
        this.wonRankingList = list;
    }
    /////////////////////////////////////////////////////////////////
    /**在线人数*/
    public onlineNumber:Object;

    /////////////////////////////////////////////////////////////////
    /**
     * 进入游戏
     * Join游戏
     * 监听消息：G32Keys.MSG_G32_GAME_JOIN
     * @param token：refeshToken 
     */
    public joinGame(token: string) {
        this.token = token;
        GameModel.joinGame(token);
    }

    /**
     * 初始化用户信息
     * @param token
     */
    initUserInfo(token: string) {
        this.setRefreshToken(token);
    }

    /**
    * 设置refreshToken
    * @param token
     */
    setRefreshToken(token: string) {
        this.token = token;
    }

    //进入先请求一次露珠
    public requestBead() {
        const gameInfoStore = G32GameManager.instance;
        GameModel.reqBeadList(gameInfoStore.roomId);
    }

    /**
     * 请求调用接口
     */
    public initWsCommand(data: GameInfo.CommandType[]) {
        if (data) {
            const commandList = data.map((item: any) => {
                if (item.command == WsCommand.Game_Data) {
                    item.data = item.payload;
                } else {
                    // item.data = {
                    //     createTime: item.createTime,
                    //     time: item.time,
                    // };
                }
                item.isCommand = true;
                return item;
            });
            commandList.forEach((item: SocketType.BetCommand) => {
                this.wsLogic(item.command as WsCommand, item);
            });
        }
        SocketioConnection.instance.socket.on("Game", (socket: SocketType.BetCommand) => {
            this.wsLogic(socket.command as WsCommand, socket.data);
        });
        SocketioConnection.instance.socket.on("User", (socket: SocketType.BetCommand) => {
            this.wsLogic(socket.command as WsCommand, socket.data);
        });
        SocketioConnection.instance.socket.on("System", (socket: SocketType.BetCommand) => {
            this.wsLogic(socket.command as WsCommand, socket.data);
        });

        this.roadBigRoadDataCalService();
    }

    public initMsgKeys(keys: string[]): void {
        keys.push(GameKeys.MSG_JOIN_GAME_PARAM);
        keys.push(GameKeys.MSG_GET_LIMIT_LIST_PARAM);
        keys.push(GameKeys.MSG_DRAW_LIST_PARAM);
        keys.push(GameKeys.MSG_GAME_BET_PARAM);
        keys.push(GameKeys.MSG_GAME_BET_CANCEL_PARAM);
        keys.push(GameKeys.MSG_BET_CONFIRMED_PARAM);
        keys.push(GameKeys.MSG_GAME_BET_RECORDS);
    }

    public onReceive(...any: any[]): void {
        console.log("any:",any)
        switch (any[0]) {
            case GameKeys.MSG_JOIN_GAME_PARAM: {
                G32Log.log("JoinGame");
                let code = any[2];
                if (code == 0) {
                    let data = any[1];
                    G32Log.debug(data);
                    let d: GameInfoRes = JSON.parse(JSON.stringify(data));

                    GameModel.getBetLimitRuleList();
                    G32GameManager.instance.delay = d.game.delay;
                    G32GameManager.instance.setCountdown(d.game.countdown);
                    G32GameManager.instance.initGameInfo(data);
                    G32GameManager.instance.kickOutLimit = (d.kickOutLimit || 15);
                    GameModel.getBetRecords(d.id, d.round.id);
  
                    //连接socket
                    SocketioConnection.instance.connect(d.id, d.game?.id, data.round?.id, this.token, d.namespace, HttpManager.instance.betLimitRuleGroupId);
                    G32GameManager.instance.initWsCommand(data.commandList);
                    dispatch(G32Keys.MSG_G32_GAME_JOIN, code);
                } else {
                    G32Log.error("Join 接口错误:" + JSON.stringify(any[1]));
                    dispatch(G32Keys.MSG_G32_GAME_JOIN, code);
                }
                break;
            }
            case GameKeys.MSG_GET_LIMIT_LIST_PARAM: {
                G32Log.log("获取限红列表");
                let code = any[2];
                if (code == 0) {
                    let data = any[1];
                    G32Log.debug(data);
                    G32GameManager.instance.setLimitRuleList(data);
                    dispatch(G32Keys.MSG_G32_LIMIT_LIST, code);
                }
                break;
            }
            case GameKeys.MSG_GAME_BET_PARAM: {
                let code = any[2];
                G32Log.log("投币回包: " + code);
                let betStore = G32BetManager.instance;
                let data: BetResType[] = any[1];
                G32Log.debug(data);

                if (code == 0) {                                  
                    betStore.updateBetLog(
                        "push",
                        data.map((betRes) => ({
                            gameWagerId: betRes.gameWagerId,
                            betAmount: betRes.betAmount,
                            logId: "",
                            orderNo: betRes.orderNo,
                        }))
                    );
                } else {
                    // 如果失败，就撤销用户投注区数据
                    data.forEach((item) => {
                        betStore.incrementUserBetAmount(Number(item.gameWagerId), -item.betAmount);
                        betStore.updateUserOriginBetAmount(Number(item.gameWagerId), -item.betAmount);
                    });
                }
                betStore.setBetRequstingCount(betStore.betRequestingCount - 1);
                dispatch(G32Keys.MSG_G32_GAME_BET, code, any[4]);
                break;
            }
            case GameKeys.MSG_GAME_BET_CANCEL_PARAM:{
                let code = any[2];
                G32Log.log("投币Cancel:" + code);
                dispatch(G32Keys.MSG_G32_GAME_BET_CANCEL, code, any[4]);
                break;
            }
            case GameKeys.MSG_BET_CONFIRMED_PARAM: {
                let code = any[2];
                G32Log.log("投币Confirmed:" + code);
                const betStore = G32BetManager.instance;
                if (code == 0) {

                } else {
                    betStore.clearBetAreaData();
                    betStore.clearUserBetData();
                    betStore.clearOriginUserBetData();
                    betStore.clearUserBetLog();
                }
                dispatch(G32Keys.MSG_G32_GAME_BET_CONFIRMED, code);
                break;
            }
            case GameKeys.MSG_DRAW_LIST_PARAM: {
                G32Log.log("获取露珠列表");
                let code = any[2];
                if (code == 0) {
                    let data = any[1];
                    G32Log.debug(data);
                    if (data) {
                        this.processers?.beadProcesser?.onBeadList(data);
                        dispatch(G32Keys.MSG_G32_GAME_BEAD, 0);
                    }
                }
                break;
            }
            case GameKeys.MSG_GAME_BET_RECORDS: {
                let code = any[2];
                let data = any[1];
                G32Log.log("当前局历史投注数据");
                if (code == 0) {
                    let betStore = G32BetManager.instance;
                    let userStore = G32UserManager.instance;
                    if (data && Array.isArray(data) && data.length > 0) {
                        data.forEach((item) => {
                            betStore.incrementUserBetAmount(item.gameWagerId, item.betAmount);
                            betStore.incrementBetAreaAmount(
                                item.gameWagerId,
                                item.userId,
                                item.betAmount
                            );
                            betStore.updateBetLog("push", [
                                {
                                    gameWagerId: item.gameWagerId,
                                    betAmount: item.betAmount,
                                    logId: "",
                                    orderNo: item.orderNo,
                                },
                            ]);
                        });

                        userStore.setBalanceTransStatus("Pending");
                    }
                    dispatch(G32Keys.MSG_G32_GAME_BET_RECORDS_CUR_ROUND, data);
                }
                break;
            }
        }
    }

    /**
     * 业务逻辑
     */
    private wsLogic(command: WsCommand, data: object) {
        switch (command.toString()) {
            case WsCommand.Bet_Start:
                G32Log.warn("G32GameManager 处理投币开始");
                this.dealBetStart(data as never);
                dispatch(G32Keys.MSG_G32_GAME_START);
                break;
            case WsCommand.Bet_Stop:
                G32Log.warn("G32GameManager 处理停止投币");
                this.wsBetStopService();
                dispatch(G32Keys.MSG_G32_GAME_STOP);
                break;
            case WsCommand.Cancel_Bet:
                G32Log.warn("G32GameManager 处理取消投币");
                this.wsCancelBetService(data as SocketBetData[]);
                dispatch(G32Keys.MSG_G32_GAME_BET_CANCEL);
                break;
            case WsCommand.Bet:
                G32Log.warn("G32GameManager 处理其他人投币指令");
                this.wsBetService(data as SocketBetData[]);
                dispatch(G32Keys.MSG_G32_GAME_POOL, data);
                break;
            case WsCommand.Change_Shoe:
                G32Log.warn("G32GameManager 处理换靴");
                this.dealChangeShoe();
                dispatch(G32Keys.MSG_G32_GAME_NEW_SHOE);
                break;
            case WsCommand.Game_Data:
                G32Log.warn("G32GameManager 处理发牌");
                this.dealDealing(data);
                dispatch(G32Keys.MSG_G32_GAME_DATA, data);
                break;
            case WsCommand.Game_Draw:
                G32Log.warn("G32GameManager 处理游戏结果");
                this.dealGameDraw(data);
                break;
            case WsCommand.Bet_Receipt:
                G32Log.warn("G32GameManager 处理派彩");
                this.wsBetReceiptService(data as SocketReceiptType);
                dispatch(G32Keys.MSG_G32_GAME_PAYOUT, data);
                break;
            case WsCommand.Balance_Update:
                G32Log.warn("G32GameManager 处理余额更新");
                this.wsBalanceUpdateService(data as {
                    balance: string;
                    currency: string;
                });
                dispatch(G32Keys.MSG_G32_GAME_BALANCE, data);
                break;
            case WsCommand.Won_Ranking:
                G32Log.warn("G32GameManager 中奖排名");
                this.wsWonRankingService(data as SocketWonRankType);
                dispatch(G32Keys.MSG_G32_WON_RANK, data);
                break;
            case WsCommand.Online_User:
                G32Log.warn("G32GameManager 处理在线人数");
                this.onlineNumber = data;
                dispatch(G32Keys.MSG_G32_ONLINE_USER, data);
                break;
            case WsCommand.Maintain:
                G32Log.warn("G32GameManager 维护中");
                this.wsMaintainService();
                dispatch(G32Keys.MSG_G32_MAINTAIN, data);
                break;
            case WsCommand.Game_Close:
                G32Log.warn("G32GameManager 游戏关闭");
                dispatch(G32Keys.MSG_G32_GAME_CLOSE, data);
                break;
            default:
                //新增定制协议，由app层自行处理
                if(this.processers?.cmdProcesser){
                    this.processers?.cmdProcesser.cmdLogic(command.toString(), data);
                }
                break;
        }
    }

    private delayIDS = new Array<number>();
    private doDelay(func: Function, _that: Object, msgKey: any, p: any = undefined) {
        let delay = this.delay;
        if (p && p.isCommand) {//中途进入, 不做延时处理
            delay = 0;
        }
        let dset = this.delayIDS;
        let id = window.setTimeout(function () {
            //删除id
            dset.filter(item => item !== id);
            func.call(_that, msgKey, p);
        }, delay);
        if (dset.indexOf(id) == -1) {
            dset.push(id);
        }
    }
    /** 开始投注 */
    private dealBetStart(data: SocketDataType) {
        this.wsBetStartService(data);
        this.processers?.cardProcesser?.cleanCards();
        this.playResultInfo = {
            isWin: false,
            winner: 0,
            count: 0,
            winArea: [],
        };
    }

    /** 游戏维护 */
    private wsMaintainService() {
        HttpRequest.authorization = "";
        SocketioConnection.instance.disconnect();
    }

    /** 停止投币处理 */
    private wsBetStopService() {
        const betStore = G32BetManager.instance;
        const userStore = G32UserManager.instance;
        const gameInfoStore = G32GameManager.instance;
        gameInfoStore.setGameStage(GameStageType.Bet_Stop);
        // 重置中奖排名列表
        gameInfoStore.setWonRankingList([]);
        gameInfoStore.setWinGameWagerList([]);
        userStore.setReceipts([]);

        if (betStore.userBetData && Object.values(betStore.userBetData).length > 0) {
            const betParamsArr = [];
            const betOriginParamsArr = [];
            let betTotalAmount = 0;
            for (const [gameWagerId, userBetInfo] of Object.entries(betStore.userBetData)) {
                if (userBetInfo.betAmount > 0) {
                    betParamsArr.push({
                        gameWagerId: Number(gameWagerId),
                        chip: userBetInfo.betAmount,
                    });
                    betTotalAmount += userBetInfo.betAmount;
                }
            }
            for (const [gameWagerId, userBetInfo] of Object.entries(betStore.userOriginBetData)) {
                if (userBetInfo.betAmount > 0) {
                    betOriginParamsArr.push({
                        gameWagerId: Number(gameWagerId),
                        chip: userBetInfo.betAmount,
                    });
                }
            }
            if (betParamsArr.length > 0) {
                GameModel.userBetConfirm({
                    gameRoomId: gameInfoStore.roomId,
                    gameRoundId: gameInfoStore.round.id,
                    betAmount: betTotalAmount,
                    bets: betParamsArr,
                    originalBets: betOriginParamsArr,
                    currency: gameInfoStore.limitRule.currency,
                    limitRule: gameInfoStore.limitRule,
                    device: Utils.getDeviceInfo(),
                    extra : this.processers?.betConfirmExtra?.getBetComfirmedExtra()
                });
            }
        }
        betStore.setUserLastBetData();
    }

    /** 投注推送逻辑 */
    private wsBetService(data: SocketType.BetCommandData[]) {
        const betStore = G32BetManager.instance;
        const gameInfoStore = G32GameManager.instance;
        betStore.setConsecMissedBetCount(0); // 只要有投注，就设置连续没有投注的数量为0
        if (data && Array.isArray(data)) {
            data.forEach((item) => {
                if (item.gameRoundId == gameInfoStore.round.id) {
                    betStore.incrementBetAreaAmount(
                    item.gameWagerId,
                    item.userId,
                    item.amount
                    );
                }
            });
        }
    }

    /**
     * 处理WS取消投注推送逻辑
     * @param data SocketBetData[]
     */
    wsCancelBetService(data: SocketBetData[]) {
        const betStore = G32BetManager.instance;
        const gameInfoStore = G32GameManager.instance;
        if (data && Array.isArray(data)) {
            data.forEach((item) => {
                if (gameInfoStore.round.id == item.gameRoundId) {
                    betStore.incrementBetAreaAmount(
                        item.gameWagerId,
                        item.userId,
                        -item.amount
                    );
                }
            });
        }
    }

    /** 处理换靴 */
    dealChangeShoe() {
        const gameLogicStore = G32GameManager.instance;
        gameLogicStore.setGameStage(GameStageType.Game_Pause);
        this.processers?.beadProcesser?.clear();
    }

    /**处理发牌 */
    dealDealing(data: any) {
        G32Log.log("dealDealing 处理发牌");
        this.processers?.cardProcesser?.doCards(data);
    }

    /**余额更新 */
    wsBalanceUpdateService(data: {
        balance: string;
        currency: string;
    }) {
        const userStore = G32UserManager.instance;
        userStore.userBalance.balance = Number.parseFloat(data.balance);
        userStore.userBalance.currency = data.currency;
        G32Log.log("wsBalanceUpdateService 处理余额账变指令", userStore.userBalance);
        userStore.setBalanceTransStatus("Settled");
    }

    /**
     * 处理游戏中奖排名指令
     * @param data
    */
    wsWonRankingService(data: SocketWonRankType) {
        const gameInfoStore = G32GameManager.instance;
        gameInfoStore.setWonRankingList(data.wonRankingList ?? []);
    }

    /** 处理投注小票指令 */
    private wsBetReceiptService(data: SocketReceiptType) {
        // 更新用户注单小票，用于显示中奖数据
        const gameInfoStore = G32GameManager.instance;
        if (gameInfoStore.round.id != data.gameRoundId) {
            G32Log.warn("dealGameReceipt round 不同");
            return;
        }
        const userStore = G32UserManager.instance;
        userStore.setReceipts(data?.receipts || []);

        const betStore = G32BetManager.instance;

        if (data.receipts && data.receipts.length > 0) {
            let winCount = 0;
            let lostCount = 0;
            data.receipts.forEach((item: DrawReceiptType) => {
                //只要金额有正的   就代表赢钱 包括 开和 退还的本金 
                if (item.winAmount > 0) {
                    winCount += item.winAmount;
                } else {
                    lostCount += item.winAmount;
                }

                betStore.incrementUserBetAmount(item.gameWagerId, item.winAmount);
            });
            this.playResultInfo.count = winCount > 0 ? winCount : lostCount;
            this.lastWin = String(this.playResultInfo.count);
            this.playResultInfo.isWin = this.playResultInfo.count > 0;
        }
    }

    /**处理游戏结果*/
    private dealGameDraw(data?: { payload?: any, isCommand?: boolean }) {
        G32Log.log("dealGameDraw 处理开奖结果");
        G32Log.debug(data);
        if (data) {
            const gameLogicStore = G32GameManager.instance;
            gameLogicStore.setGameStage(GameStageType.Draw);

            G32Log.log("开奖结果", data);
            if (data?.payload) {
                this.playResultInfo.winArea = data?.payload?.result || [];
                this.processers?.beadProcesser?.onAddBead(data?.payload);
                if (data.isCommand) {//中途进入  牌恢复
                    this.processers?.cardProcesser?.doCards(data?.payload);
                    dispatch(G32Keys.MSG_G32_GAME_REVERT_POKERS);
                }
                dispatch(G32Keys.MSG_G32_GAME_RESULT);
            } else {
                //重新请求露珠列表
                this.roadBigRoadDataCalService();
            }
        }
    }

    /** 开始投币 */
    private wsBetStartService(data: SocketDataType) {
        G32Log.log("dealBetStart", data);
        const socketStore = SocketioConnection.instance;
        const betStore = G32BetManager.instance;
        const userStore = G32UserManager.instance;

        const timerStore = G32GameManager.instance;
        const gameInfoStore = G32GameManager.instance;
        const gameLogicStore = G32GameManager.instance;

        // 中途加入判断
        if (data.isCommand) {
            const startTime = new Utc0(data.time).timestamp;
            const currentTime = new Utc0(new Date()).timestamp;
            timerStore.setStartTime(startTime);
            timerStore.setCurTime(currentTime);
        } else {
            timerStore.setStartTime(new Utc0(new Date()).timestamp);
            timerStore.setCurTime(new Utc0(new Date()).timestamp);
            betStore.clearBetAreaData();
            betStore.clearUserBetData();
            betStore.clearOriginUserBetData();
            betStore.clearUserBetLog();
            betStore.setConsecMissedBetCount(betStore.consecMissedBetCount + 1);
            gameInfoStore.setRound({ id: data.gameRoundId!, roundNo: (data.data as SocketBetStartType)?.header?.roundNo! });
        }

        gameInfoStore.setWinGameWagerList([]);
        if (userStore.receipts && userStore.receipts.length > 0) {
            userStore.setLastReceipts(userStore.receipts);
        }
        userStore.setReceipts([]);
        gameInfoStore.setWinGameWagerList([]);

        gameLogicStore.setGameStage(GameStageType.Bet_Start);

        if (betStore.consecMissedBetCount > timerStore.kickOutLimit) {
            socketStore.disconnect();
            timerStore.setCountdown(0);
            clearInterval(userStore.balanceTimer);
            HttpRequest.authorization = "";
            gameInfoStore.setRefreshToken("");
        }
    }

    private roadBigRoadDataCalService() {
        const gameInfoStore = G32GameManager.instance;
        GameModel.reqBeadList(gameInfoStore.roomId);
    }

    /**
     * 判断这个玩法投币额是否达到限红
     * @param gameWagerId
     */
    public isGameWagerLimitRange(gameWagerId: number, betAmount: number): number {
        const betStore = G32BetManager.instance;
        const gameInfoStore = G32GameManager.instance;
        const limitRules = gameInfoStore.limitRuleList;
        const limitRule = limitRules.find((item) => item.gameWagerId == gameWagerId);
        const totalBetAmount = betStore.userBetData[gameWagerId]?.betAmount ?? 0;
        const wagerBetAmountTotal = betAmount + totalBetAmount;
        const userStore = G32UserManager.instance;
    
        if (!limitRule) {
            return -1;
        }
        if (totalBetAmount >= limitRule.maxAmount) {         
            return -2;
        }
        if (wagerBetAmountTotal < limitRule.minAmount) {
            return -3;
        }
        if (wagerBetAmountTotal > limitRule.maxAmount) {
            //最后一注 或 限红最大封顶差值
            return Math.min(
                limitRule.maxAmount - totalBetAmount,
                userStore.calculateUserBalance()
            );
        }
        return 0;
    }

    /**
     * 投币
     * @param betArr 
     */
    public bet(betArr: { gameWagerId: number; chip: number }[], extra:Object): number {
        const betStore = G32BetManager.instance;
        const gameStore = G32GameManager.instance;
        const userStore = G32UserManager.instance;
        // 只有在开始投币阶段 才可以
        if (gameStore.gameStage !== GameStageType.Bet_Start) {       
            return -1;
        }

        betArr = betArr.filter((item) => item.chip > 0);
        if (betArr.length == 0) return -2;

        // 只有足够额度
        const betAmount = betArr.reduce((acc, cur) => acc + cur.chip, 0);
        if (betAmount > userStore.calculateUserBalance()) {
            return -3;
        }

        // 判断每个投注区的限额
        for (const item of betArr) {
            if (this.isGameWagerLimitRange(item.gameWagerId, item.chip) != 0 ) {
                return -4;
            }
        }

        G32UserManager.instance.setBalanceTransStatus("Pending");
        // 提前更新用户投注数据
        betArr.forEach((data) => {
            betStore.incrementUserBetAmount(Number(data.gameWagerId), data.chip);
            betStore.updateUserOriginBetAmount(Number(data.gameWagerId), data.chip);
        });
        betStore.setBetRequstingCount(betStore.betRequestingCount + 1);

        GameModel.bet({
            gameRoomId: gameStore.roomId,
            gameRoundId: gameStore.round.id,
            betAmount: betAmount,
            currency: gameStore.limitRule.currency,
            bets: betArr,
            limitRule: gameStore.limitRule,
            device: Utils.getDeviceInfo(),
            extra: extra,
        });
    }

    /**
     * 取消下注的最后一步
     */
    public cancelLastBet():number{
        G32Log.log("cancelLastBet");

        const betStore = G32BetManager.instance;
        const gameInfoStore = G32GameManager.instance;

        if (betStore.userBetLog.length == 0) {
            return -1;
        }
        if (betStore.betRequestingCount > 0) {
            return -2;
        }
        const lastBetLog = betStore.userBetLog[betStore.userBetLog.length - 1];

        GameModel.betCancel({
            gameRoomId: gameInfoStore.roomId,
            gameRoundId: gameInfoStore.round.id,
            device: Utils.getDeviceInfo(),
            orderNoList:lastBetLog.map((item) => item.orderNo)
        });

        lastBetLog.forEach((betLog) => {
            // 更新该用户投注区数据
            betStore.incrementUserBetAmount(betLog.gameWagerId, -betLog.betAmount);
        });
        betStore.updateBetLog("pop");   
    }

    /** 退出桌台 */
    exitTable() {
        G32Log.log("base --->exitTable");
        this.delayIDS.forEach((k: number) => {
            window.clearTimeout(k);
        });
        this.delayIDS = [];
        SocketioConnection.instance.disconnect();
    }
}
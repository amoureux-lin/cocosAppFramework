import { EventProcessor } from "../utils/G32SdkEventProcessor";
import G32UserManager from "./G32UserManager";

// export const chipConfigList = [
//     { money: 50, color: "#144d28", text: "50", fontSize: 12 },
//     { money: 200, color: "#000", text: "200", fontSize: 12 },
//     { money: 500, color: "#2d8626", text: "500", fontSize: 12 },
//     { money: 1250, color: "#ad210d", text: "1250", fontSize: 10 },
//     { money: 3000, color: "#3d2079", text: "3000", fontSize: 10 },
// ];

/**
 * 投币行为管理器
 */
export default class G32BetManager extends EventProcessor implements ISingleton {

    isResident?: boolean = true;
    static module: string = "【投币管理器】";
    module: string = null!;
    public chipList: GameInfo.Chip[] = [];

    protected static _instance: G32BetManager = null!;
    public static get instance() { return this._instance || (this._instance = new G32BetManager()); }

    init(...args: any[]) {

    }

    destory(...args: any[]) {
        this.onDestroy();
    }
    ///////////////////////////////////////////////////////////////////////

    /** 当前选中的筹码 */
    public activeChip: number = 0;
    /** 设置可选筹码列表 */
    public setChipList(chips: GameInfo.Chip[]) {
        this.chipList = chips;
        this.activeChip = chips[0].chip;
    }

    /**
     * 切换当前筹码
     * @param chipValue
     */
    toggleChip(chipValue: number) {
        this.activeChip = chipValue;
    }

    /** 投币区域的数据状态 */
    public betAreaData: BetAreaData = {};

    /**
     * 设置投币区投币数据
     * @param gameWagerId 投币区Id
     * @param userId
     * @param betInfo
     */
    setBetAreaData(gameWagerId: number, userId: string, betInfo: { betAmount: number }) {
        if (!this.betAreaData[gameWagerId]) {
            this.betAreaData[gameWagerId] = {
                userBetInfo: {},
            };
        }
        this.betAreaData[gameWagerId].userBetInfo[userId] = betInfo;
    }

    /**
     * 增加投币区投币额
     * @param gameWagerId
     * @param userId
     * @param betAmount
     */
    incrementBetAreaAmount(gameWagerId: number, userId: string, betAmount: number) {
        if (!this.betAreaData[gameWagerId]) {
            this.betAreaData[gameWagerId] = {
                userBetInfo: {},
            };
        }
        if (!this.betAreaData[gameWagerId].userBetInfo[userId]) {
            this.betAreaData[gameWagerId].userBetInfo[userId] = { betAmount: 0 };
        }
        this.betAreaData[gameWagerId].userBetInfo[userId].betAmount += betAmount;
    }

    /**
     * 清空投币区数据
     */
    clearBetAreaData() {
        Object.keys(this.betAreaData).forEach((key) => {
            this.betAreaData[Number(key)] = { userBetInfo: {} };
        });
    }

    /**该用户投币数据 */
    public userBetData: UserBetDataType = {};

    /**
     * 清空用户投币数据
     */
    clearUserBetData() {
        this.userBetData = {};
    }

    /**
     * 设置用户投币数据
     * @param betData
     */
    setUserBetData(betData: UserBetDataType) {
        this.userBetData = betData;
    }

    /** 用户原始投币数据，只要当前轮投币之后就会产生，并且在本轮结束之后清除 */
    public userOriginBetData: UserBetDataType = {};

    /**
     * 清空用户投币数据
     */
    clearOriginUserBetData() {
        this.userOriginBetData = {};
    }

    /**
     * 根据类型设置投币数据
     */
    setBetDataByType(betData: UserBetDataType, type: "userBetData" | "userLastBetData" | "userOriginBetData") {
        switch (type) {
            case "userBetData":
                this.userBetData = betData;
                break;
            case "userLastBetData":
                this.userLastBetData = betData;
                break;
            case "userOriginBetData":
                this.userOriginBetData = betData;
                break;
        }
    }

    /**
     * 更新用户投币区投币额
     * @param gameWagerId
     * @param betAmount
     */
    incrementUserBetAmount(gameWagerId: number, betAmount: number) {
        if (!this.userBetData[gameWagerId]) {
            this.userBetData[gameWagerId] = { betAmount: 0 };
        }
        this.userBetData[gameWagerId] = {
            ...this.userBetData[gameWagerId],
            betAmount: this.userBetData[gameWagerId].betAmount + betAmount,
        };
    }

    /**
     * 更新用户投币区Origin投币额
     * @param gameWagerId
     * @param betAmount
     */
    updateUserOriginBetAmount(gameWagerId: number, betAmount: number) {
        if (!this.userOriginBetData[gameWagerId]) {
            this.userOriginBetData[gameWagerId] = { betAmount: 0 };
        }
        this.userOriginBetData[gameWagerId] = {
            ...this.userOriginBetData[gameWagerId],
            betAmount: this.userOriginBetData[gameWagerId].betAmount + betAmount,
        };
    }

    // 用户投币Log记录
    public userBetLog: BetLogType[][] = [];

    /**
     * 清空用户投币Log记录
     */
    clearUserBetLog() {
        this.userBetLog = [];
    }

    /**
     * 更新用户投币日志
     * @param payload
     * @param betLog
     */
    updateBetLog(payload: "push" | "pop", betLog?: BetLogType[]) {
        switch (payload) {
            case "pop":
                this.userBetLog.pop();
                break;
            case "push":
                betLog && this.userBetLog.push(betLog);
                break;
        }
    }

    // 用户总投币计算属性
    public get userTotalBetAmount() {
        let betAmount = 0;
        Object.values(this.userBetData).forEach((item: any) => {
            betAmount += item.betAmount;
        });
        return betAmount;
    }

    // 用户上一轮游戏投币记录
    public userLastBetData: UserBetDataType | null = null;

    /**
     * 设置用户上一轮游戏投币记录
     */
    setUserLastBetData() {
        this.userLastBetData = JSON.parse(JSON.stringify(this.userBetData));
    }

    // 用户连续未投币次数(只有用户在游戏中才计算)
    public consecMissedBetCount = 0;

    /**
     * 设置用户连续未投币次数
     * @param count
     */
    setConsecMissedBetCount(count: number) {
        this.consecMissedBetCount = count;
    }

    // 用户正在请求投注的数量
    public betRequestingCount = 0;
    setBetRequstingCount(num: number) {
        this.betRequestingCount = num;
    }

}
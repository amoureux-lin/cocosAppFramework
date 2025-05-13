import { EventProcessor } from "../utils/G32SdkEventProcessor";
import { G32Keys } from "./G32Keys";
import UserModel, { UserKeys } from "../http/UserModel";
import { HttpRequest } from "../http/HttpRequest";
import { G32Log } from "../utils/G32Log";
import G32BetManager from "./G32BetManager";

export default class G32UserManager extends EventProcessor implements ISingleton {

    isResident?: boolean = true;
    static module: string = "【User管理器】";
    module: string = null!;
    sessionId: string = "";
    loginName: string = "";


    protected static _instance: G32UserManager = null!;
    public static get instance() { return this._instance || (this._instance = new G32UserManager()); }

    init(...args: any[]) {

    }

    destory(...args: any[]) {
        this.onDestroy();
    }
    //////////////////////////////////////////////////////////////////
    /** 用户balance数据 */
    public userBalance: BalanceType = {
        balance: 0,
        currency: "",
        transStauts: "Settled",
    };

    /** 余额定时器轮询实例 */
    public balanceTimer = -1;

    public initMsgKeys(keys: string[]): void {
        keys.push(UserKeys.MSG_GET_BALANCE_PARAM);
    }

    public onReceive(...any: any[]): void {
        switch (any[0]) {
            case UserKeys.MSG_GET_BALANCE_PARAM: {
                let code = any[2];
                if (code == 0) {
                    let data = any[1];
                    G32Log.debug(data);
                    let d: BalanceType = JSON.parse(JSON.stringify(data));
                    this.userBalance.balance = d.balance;
                    this.userBalance.currency = d.currency;
                    dispatch(G32Keys.MSG_G32_GAME_BALANCE);
                } else {
                    // this.token = "";
                    G32Log.error("getBalance接口错误:" + JSON.stringify(any[1]));
                }
                break;
            }
        }
    }

    /**
     * 更新余额数据
     *
     * 获取余额
     * 监听消息：G32Keys.MSG_G32_GAME_BALANCE
     * 数据：NewUserManager.instance.userBalance;
     *
     */
    public refreshBalance() {
        UserModel.getBalance();
    }

    /**计算用户当前余额（原本余额刷新通知有延迟） */
    public calculateUserBalance() {
        let curBalance = G32UserManager.instance.userBalance.balance;
        let betAmount = G32BetManager.instance.userTotalBetAmount;
        return curBalance - betAmount;
    }

    /**
     * 设置账变状态
     * @param status
     */
    setBalanceTransStatus(status: "Pending" | "Settled") {
        this.userBalance.transStauts = status;
    }

    //////////////////////////////////////////////////////////////////////
    // 用户中奖的小票列表
    receipts: DrawReceiptType[] = [];
    setReceipts(userReceipts: DrawReceiptType[]) {
        this.receipts = userReceipts;
    }

    // 用户上一次中奖的小票列表
    lastReceipts: DrawReceiptType[] = [];
    setLastReceipts(userReceipts: DrawReceiptType[]) {
        this.lastReceipts = userReceipts;
    }
}
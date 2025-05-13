import { QParam, HttpManager } from "./HttpManager";

/**
 * 请求回调消息key
 */
export enum UserKeys{
    MSG_GET_BALANCE_PARAM = "MSG_GET_BALANCE_PARAM",
}

/**
 * 请求调用接口
 */
export default class UserModel {
    /*
     * 获取余额
     * 监听消息：G32Keys.MSG_G32_GAME_BALANCE
     * 数据：UserManager.instance.userBalance;
     */
    public static getBalance() {      
        let param = new GetBalanceParam();
        const queryManager = HttpManager.instance;
        queryManager.requestWithGet(param);
    }
}

export class GetBalanceParam extends QParam {

    path(): string {
        return "wallet/getBalance";
    }

    msgKey(): string {
        return UserKeys.MSG_GET_BALANCE_PARAM;
    }

    public getQuery(): string {
        return "";
    }
}
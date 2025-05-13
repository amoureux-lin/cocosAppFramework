import { _decorator } from "cc";
import { G32Keys } from "../data-sdk/manager/G32Keys";
import G32SdkEventComponent from "../data-sdk/utils/G32SdkEventComponent";

const { ccclass, property } = _decorator;
@ccclass("SDKEvent")
export class SDKEvent extends G32SdkEventComponent{
    /** 子函数必须在此初始化消息, 否则需要动态自动进行注册 */
    initMsgKeys(keys: string[]) {
        keys.push(G32Keys.MSG_G32_GAME_JOIN);
        keys.push(G32Keys.MSG_G32_GAME_BALANCE);
        keys.push(G32Keys.MSG_G32_GAME_START);
        keys.push(G32Keys.MSG_G32_GAME_STOP);
        keys.push(G32Keys.MSG_G32_GAME_DATA);
        keys.push(G32Keys.MSG_G32_GAME_RESULT);
        keys.push(G32Keys.MSG_G32_GAME_BEAD);
        keys.push(G32Keys.MSG_G32_GAME_NEW_SHOE);
        keys.push(G32Keys.MSG_G32_GAME_BET);
        keys.push(G32Keys.MSG_G32_MAINTAIN);
        keys.push(G32Keys.MSG_G32_GAME_BET_CONFIRMED);
    }

    onReceive(...any: any[]): void {
        app.log.log("SDKEvent",any);
        switch (any[0]) {
            case G32Keys.MSG_G32_GAME_JOIN:
                break;
        }
    }
}


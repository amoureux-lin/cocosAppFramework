import { _decorator } from "cc";
import G32GameManager from "../data-sdk/manager/G32GameManager";
import GameModel, { GameKeys } from "../data-sdk/http/GameModel";
import { G32Keys } from "../data-sdk/manager/G32Keys";

const { ccclass, property } = _decorator;
@ccclass("SDKGame")
export class SDKGame extends G32GameManager{

    protected static _instance: SDKGame = null!;
    public static get instance() { return this._instance || (this._instance = new SDKGame()); }

    public onReceive(...any: any[]): void {
        app.log.log("SDKGame",any);
        switch (any[0]) {
            case GameKeys.MSG_JOIN_GAME_PARAM: 
                let code = any[2];
                if (code == 0) {
                    let data = any[1];
                    app.log.debug(data);
                    let d: GameInfoRes = JSON.parse(JSON.stringify(data));
                    GameModel.getBetLimitRuleList();
                    G32GameManager.instance.delay = d.game.delay;
                    G32GameManager.instance.setCountdown(d.game.countdown);
                    G32GameManager.instance.initGameInfo(data);
                    G32GameManager.instance.kickOutLimit = (d.kickOutLimit || 15);
                    GameModel.getBetRecords(d.id, d.round.id);
              
                    //连接socket
                   app.log.log('连接socket');
                } else {
                    app.log.error("Join 接口错误:" + JSON.stringify(any[1]));
                    dispatch(G32Keys.MSG_G32_GAME_JOIN, code);
                }
                break;
            default:
                super.onReceive(...any);
                break;
        }
    }
}


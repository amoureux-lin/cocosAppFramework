import { Config } from "../config/Config";
import GameModel from "../http/GameModel";
import { UserKeys } from "../http/UserModel";
import G32GameManager from "../manager/G32GameManager";
import { G32Keys } from "../manager/G32Keys";
import { G32Log } from "../utils/G32Log";
import { EventProcessor } from "../utils/G32SdkEventProcessor";

export default class SocketioConnection extends EventProcessor implements ISingleton {

    public socket:any;

    private roomId:string;
    private gameId:string;
    private gameRoundId:string;
    private token:string;
    private limitRuleGroupId:string;

    isResident?: boolean = true;
    static module: string = "【Socket管理器】";
    module: string = null!;

    protected static _instance: SocketioConnection = null!;
    public static get instance() { return this._instance || (this._instance = new SocketioConnection()); }

    init(...args: any[]) {
       
    }

    destory(...args: any[]) {
        
    }
    //////////////////////////////////////////////////////////////////
    /**
     * 	 * 	connect
		 * 	connect_error
		 * 	connect_timeout
		 * 	connecting
		 * 	disconnect
		 * 	error
		 * 	reconnect
		 * 	reconnect_attempt
		 * 	reconnect_failed
		 * 	reconnect_error
		 * 	reconnecting
		 * 	ping
		 * 	pong
     * @param roomId 
     * @param gameId 
     * @param gameRoundId
     * @param token
     * @param namespace 
     * @param limitRuleGroupId 
     * @returns 
     */
    connect(
        roomId: string,
        gameId: string,
        gameRoundId: string,       
        token: string,
        namespace: string,
        limitRuleGroupId:string) {
        if(!roomId || roomId.length==0) {
            G32Log.log("socket连接失败");
            return;
        }
        this.socket = io(`${Config.ws_url}/${namespace}`, {
            transports: ["websocket", "polling"],
            reconnectionDelay: 2000,
            timeout: 8000,
            query: {
                token,
            },
        });

        this.roomId = roomId;
        this.gameId = gameId;
        this.gameRoundId = gameRoundId;
        this.token = token;
        this.limitRuleGroupId = limitRuleGroupId;

        this.socket.on("connect", () => {
            G32Log.warn("socket 链接成功, Join");
            GameModel.getCommandHistory(roomId, gameRoundId);  
        });
        this.socket.on("ChatRoom", (socket: SocketType.BetCommand) => {
            G32Log.log("ChatRoom", socket.command);
        });
        // this.socket.on("System", (socket: SocketType.BetCommand) => {
        //     G32Log.log("System", socket.command);
        // });
        this.socket.on("connect_error", (error: unknown) => {
            G32Log.error("connect_error:", error);
        });
        this.socket.on("connect_timeout", (error: unknown) => {
            G32Log.error("connect_timeout:", error);
        });
        this.socket.on("error", (error: unknown) => {
            G32Log.error("error:", error);
        });
        this.socket.on("reconnect", (error: unknown) => {
            G32Log.error("reconnect:", error);
        });
    }

    disconnect() {
        if(this.socket) {
            this.socket.disconnect();
            G32Log.log("socket 关闭");
        }       
    }

    public initMsgKeys(keys: string[]): void {
        keys.push(G32Keys.MSG_G32_COMMAND_HISTORY);
    }

    public onReceive(...any: any[]): void {
        switch (any[0]) {
            case G32Keys.MSG_G32_COMMAND_HISTORY: {
                let code = any[2];
                if (code == 0) {
                    let data:GameInfo.CommandType[] = any[1];
                    G32Log.debug(data);
                    G32GameManager.instance.initWsCommand(data);
                    this.socket.emit("Join", {event:"Game", 
                    payload:{gameRoomId: this.roomId, gameId:this.gameId, gameRoundId: this.gameRoundId, limitRuleGroupId: this.limitRuleGroupId}});
                } else {
                    // this.token = "";
                    G32Log.error("getBalance接口错误:" + JSON.stringify(any[1]));
                }
                break;
            }
        }
    }
}

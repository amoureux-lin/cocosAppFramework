import { _decorator, Component, Label, Node, tween } from 'cc';
import { tips } from '../TipsManager/TipsManager';
import { DropBallUIID } from '../config/GameUIConfig';
import { EventMessage } from '../config/EventMessage';
const { ccclass, property } = _decorator;

@ccclass('DropBallMain')
export class DropBallMain extends Component {

    @property({type:Label,tooltip:"当前筹码"})
    currentBetNum:Label = null;

    @property({type:Node,tooltip:"底部筹码面板"})
    betPannel:Node = null;


    protected onLoad(): void {
        this.betPannel.active = false;
        app.event.on(EventMessage.CLIENT_MSG_UPDATE_CURRENT_COIN,this);

        this.init();
    }
    protected onDestroy(): void {
        app.event.off(EventMessage.CLIENT_MSG_UPDATE_CURRENT_COIN,this);
    }


    init(){
        this.updateCurrentCoin(app.stringUtil.numberToThousand(100,0));
    }


    openTest(){
        app.gui.toast("6666");
    }

    openConfirm(){
        tips.confirm();
    }

    //打开菜单
    openMenu(){
        tips.menu();
    }

    //打开下注筹码选择面板
    openBetPannel(){
        this.betPannel.active = !this.betPannel.active;
    }

    update(deltaTime: number) {
        
    }

    /**
     * 更新当前金币
     * @param numStr 底部金币显示数量
     */
    updateCurrentCoin(numStr:string){
        this.currentBetNum.string = numStr;
    }

    //消息监听回调
    onHandler(msg:string,args:any){
        switch(msg){
            case EventMessage.CLIENT_MSG_UPDATE_CURRENT_COIN:
                app.log.debug('更新当前金币',args)
                this.updateCurrentCoin(args)
            break;
        }
    }
}



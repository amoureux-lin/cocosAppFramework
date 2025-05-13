import { _decorator, Button, Component, EventHandler, Label, misc, Node, Sprite, tween, UIOpacity, v2, v3 } from 'cc';
import { EventMessage } from '../config/EventMessage';
const { ccclass, property } = _decorator;

@ccclass('BetPanel')
export class BetPanel extends Component {

    
    @property({type:Node,tooltip:'金币'})
    originalCoin:Node = null;

    @property({type:Node,tooltip:'列表'})
    parentCoin:Node = null;

    @property({type:Node,tooltip:'背景'})
    bgNode:Node = null;

    @property({type:Node,tooltip:'圈背景L'})
    circleLNode:Node = null;

    @property({type:Node,tooltip:'圈背景R'})
    circleRNode:Node = null;

    private _nodePool: any = null;       //节点对象池
    private _coinList = [5,10,50,100,500,1000,10000];
    private _nodeList:Array<Node> = [];

    protected onLoad(): void {
        this.initCurrentCoin();
    }

    protected onEnable(): void {
        this._nodePool = new app.nodePool();
        this.putPoolNode(this.originalCoin);
        this.parentCoin.removeAllChildren();
        this._nodeList = [];
        this.init();
    }

    protected onDestroy(): void {
        if (this._nodePool) {
            this._nodePool.clearAll();
            this._nodePool = null;
        }
    }

    /**
     * 回收节点
     */
    public putPoolNode(node) {
        return this._nodePool.put(node, node.name);
    }

    /**
     * 获取节点
     * @param nodeName
     */
    public getPoolNode(nodeName) {
        return this._nodePool.get(nodeName);
    }

    initPool(){
        this._nodePool = new app.nodePool()
    }

    //初始化初始位置
    init(){
        this.bgNode.getComponent(UIOpacity).opacity = 0;
        this.circleLNode.getComponent(UIOpacity).opacity = 0;
        this.circleLNode.setScale(v3(0.8,0.8,1));
        this.circleRNode.getComponent(UIOpacity).opacity = 0;
        this.circleRNode.setScale(v3(0.8,0.8,1));

        let points = this.getRadPoints(80);
        for (let i = 0; i < points.length; i++) {
            let item:Node = this.getPoolNode(this.originalCoin.name)
            item.setPosition(points[i]);
            item.getChildByName("Label").getComponent(Label).string = app.stringUtil.numberToThousand(this._coinList[i],0);
            item.getComponent(Button).clickEvents[0].customEventData = `${i}`;
            this.parentCoin.addChild(item);
            //点击事件 添加回调
            // const clickEventHandler = new EventHandler();
            // clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
            // clickEventHandler.component = 'BetPannel';// 这个是脚本类名
            // clickEventHandler.handler = 'clickCoinCallBack'; //回调函数名
            // clickEventHandler.customEventData = `${i}`; //赋予参数
            // const button = item.getComponent(Button);
            // button.clickEvents.push(clickEventHandler);
            this._nodeList.push(item);
        }
        this.startTweenAni();
    }

    //播放展开动画
    startTweenAni(){
        let points = this.getRadPoints();
        const duration = 0.06;
        this._nodeList.forEach((node:Node,index:number) => {
            this.scheduleOnce(()=>{
                tween(node).to(duration+index*0.01,{position:points[index]}).start();
            },index*0.01)
        });
        tween(this.bgNode.getComponent(UIOpacity)).to(0.3,{opacity:255}).start();
        tween(this.circleLNode.getComponent(UIOpacity)).to(0.2,{opacity:255}).start();
        tween(this.circleRNode.getComponent(UIOpacity)).to(0.2,{opacity:255}).start();
        tween(this.circleLNode).to(0.3,{scale:v3(1,1,1)}).start();
        tween(this.circleRNode).to(0.3,{scale:v3(1,1,1)}).start();
    }

    /**
     * 初始化当前金币
     */
    initCurrentCoin(){
        
    }

    //coin展开回调方法
    clickCoinCallBack(event:any,params:any){
        let index = Number(params);
        let str = app.stringUtil.numberToThousand(this._coinList[index],0);
        console.log(str);
        app.event.dispatchEvent(EventMessage.CLIENT_MSG_UPDATE_CURRENT_COIN,str)
        this.clickClosePannel();
    }

    clickClosePannel(){
        this.node.active = false;
    }

    //获取coin在圆弧坐标最终坐标点
    getRadPoints(radius:number = 243):any[]{
        let points = [];
        let numPoints = 7;
        let angleStep = 180 / (numPoints-1);
        for (let i = (numPoints-1); i >= 0; i--) {
            let angleDeg = i * angleStep; //当前角度
            let angleRad = misc.degreesToRadians(angleDeg); //旋转弧度
            let x = radius * Math.cos(angleRad);
            let y = radius * Math.sin(angleRad);
            points.push(v3(x,y));
        }
        return points;
    }

    update(deltaTime: number) {
        
    }
}



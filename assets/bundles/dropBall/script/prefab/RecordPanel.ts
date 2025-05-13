import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RecordPanel')
export class RecordPanel extends Component {

    @property({type:Node,tooltip:''})
    percentage:Node = null;

    @property({type:Node,tooltip:''})
    percentageItem:Node = null;

    @property({type:Node,tooltip:''})
    scrollView:Node = null;

    @property({type:Node,tooltip:''})
    scrollViewItem:Node = null;

    private _nodePool: any = null;       //节点对象池

    private areaList:Array<string> = ['9','10','J','Q','K','A'];

    protected onEnable(): void {
        this._nodePool = new app.nodePool();
        this.putPoolNode(this.percentageItem);
        this.percentage.removeAllChildren();
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

    //初始化
    init(){
        for (let i = 0; i < this.areaList.length; i++) {
            let item:Node = this.getPoolNode(this.percentageItem.name);
            let num = app.randomUtil.getRandomFloat(0.1,0.9);
            item.getComponent(ProgressBar).progress = num;
            item.getChildByName('progress').getComponent(Label).string = (num * 100).toFixed(0) + '%';
            item.getChildByName('poker').getComponent(Label).string = this.areaList[i];
            this.percentage.addChild(item);
        }
    }

    update(deltaTime: number) {
        
    }
}



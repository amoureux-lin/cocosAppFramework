import { _decorator, Component, Label, ProgressBar } from 'cc';
import { UIID } from 'db://assets/script/Config/GameUIConfig';
import { GameUIData } from '../config/GameUIConfig';
const { ccclass, property } = _decorator;

@ccclass('DropBallLoading')
export class DropBallLoading extends Component {

    @property({type:ProgressBar})
    ProgressBar:ProgressBar = null;

    @property({type:Label})
    processLab:Label = null

    protected onLoad(): void {
        let progressBar = this.ProgressBar.getComponent(ProgressBar);
        progressBar.progress = 0;
        this.processLab.string = `0%`;
        app.gui.add(GameUIData);
        this.loadRes();
    }

    onAdded(node,params){
        console.log('node,params',node,params);
    }


    protected async loadRes() {
        app.res.loadDir("common", ()=>{
            app.res.loadByBundle('dropBall',this.onProgressCallback.bind(this),this.onCompleteCallback.bind(this))
        });
    }

    /** 加载进度事件 */
    protected onProgressCallback(finished: number, total: number, item: any) {
        let progress = finished/total;
        this.processLab.string = `${(progress * 100).toFixed(2)}%`
        let progressBar = this.ProgressBar.getComponent(ProgressBar);
        progressBar.progress = progress
    }

    /** 加载完成事件 */
    protected onCompleteCallback() {
        this.processLab.string = `100%`;
        app.gui.replace(UIID.Loading,UIID.Main)
    }
}



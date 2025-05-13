import { Sprite } from 'cc';
import { Event } from 'cc';
import { SpriteFrame } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { Framework } from 'db://framework/Framework';
const { ccclass, property } = _decorator;

@ccclass('MusicToggleComponent')
export class MusicToggleComponent extends Component {

    @property({type:SpriteFrame})
    default: SpriteFrame = null;

    @property({type:SpriteFrame})
    checked: SpriteFrame = null;

    private _open:boolean = false;

    protected onLoad(): void {
        this._open = app.audio.switchMusic;
        this.changeSpriteFrame();
    }

    onClick(){
        this._open = !this._open;
        this.changeSpriteFrame();
        app.audio.switchMusic = this._open;
        app.audio.switchEffect = this._open;
    }

    changeSpriteFrame(){
        if(this._open){
            this.node.getComponent(Sprite).spriteFrame = this.default;
        } else {
            this.node.getComponent(Sprite).spriteFrame = this.checked;
        }
    }
}



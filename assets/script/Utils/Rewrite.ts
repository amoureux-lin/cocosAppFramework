import { Component } from "cc";
import { Button } from "cc";

export class Rewrite{
    public static init(){
        //重写button点击结束方法
        Button.prototype["_onTouchEnded"] = function(event){
            if (this.node.group != "novoice" ) {
                app.audio.playEffect("audios/Click");
            }
        
            if (!this.interactable || !this.enabledInHierarchy) return;
            if (this._pressed) {
                Component.EventHandler.emitEvents(this.clickEvents, event);
                this.node.emit('click', this);
            }
            this._pressed = false;
            this._updateState();
        }
    }
}
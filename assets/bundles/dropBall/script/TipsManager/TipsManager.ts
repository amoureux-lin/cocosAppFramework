import { Color, tween, v3, Vec3 } from "cc";
import { UIID } from "db://assets/script/Config/GameUIConfig";
import { DropBallUIID } from "../config/GameUIConfig";

class TipsManager{
    confirm(){
        let operate: any = {
            title: '提示',
            content: '内容',
            okWord: "ok",
            cancelWord: 'cancal',
            okFunc: () => {
                
            },
            cancelFunc: () => {

            },
            needCancel: true
        };
        app.gui.open(UIID.Confirm, operate, {
            // 节点添加动画
            onAdded: (node, params) => {
                node.setScale(0.1, 0.1, 0.1);
                tween(node)
                    .to(0.2, { scale: new Vec3(1, 1, 1) })
                    .start();
            },
            // 节点删除动画
            onBeforeRemove: (node, next) => {
                tween(node)
                    .to(0.2, { scale: new Vec3(0.1, 0.1, 0.1) })
                    .call((target, data) => {
                        next();
                    })
                    .start();
            },
        });
    }

    menu(){
        app.log.log("菜单");
        app.gui.open(DropBallUIID.Personal, {maskColor:new Color(0,0,0,150)}, {
            // 节点添加动画
            onAdded: (node, params) => {
                tween(node).to(0,{position:v3(-1000,0,0)}).to(0.2, { position: new Vec3(-63.5, 0, 0) }).start();
            },
            // 节点删除动画
            onBeforeRemove: (node, next) => {
                tween(node).to(0,{position:v3(-63.5,0,0)}).to(0.2, { position: new Vec3(-1000, 0, 0) }).call((target, data) => {
                    next();
                }).start();
            },
        });
        
    }
}

export var tips = new TipsManager();
import { _decorator, Component, Node } from 'cc';
import { RootComponent } from 'db://framework/component/RootComponent';
import { config } from './Config/Config';
import { CommonUIData, GameUIData, UIID } from './Config/GameUIConfig';
import { Rewrite } from './Utils/Rewrite';
import { sdkBridge } from './data-sdk-bridge/SDKBridge';
import { SDKEvent } from './data-sdk-bridge/SDKEvent';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends RootComponent {

    protected onLoad(): void {
        super.onLoad();
        //开启日志
        app.log.setLogOpen(true);
        //初始化配置
        this.initConfig(config);

        //引擎方法重写
        Rewrite.init();

        this.persist.addComponent(SDKEvent);
        sdkBridge.init();
        sdkBridge.joinGame();
    }


    protected initUi(){
        //初始化公共UI配置
        app.gui.init(CommonUIData);
        //初始启动UI配置
        app.gui.add(GameUIData);
        app.log.info("打开loading")
        app.gui.open(UIID.Loading);
    }

    update(deltaTime: number) {
        
    }
}



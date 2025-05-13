import { _decorator, Component, director, game, Game, Node, ResolutionPolicy, view } from 'cc';
import { LayerManager } from '../gui/layer/LayerManager';
import { ConfigManager } from '../Core/Managers/ConfigManager';
import { AudioManager } from '../Core/Managers/audio/AudioManager';
import { Framework } from '../Framework';
const { ccclass, property } = _decorator;

@ccclass('RootComponent')
export class RootComponent extends Component {
    
    /** 框架常驻节点 */
    public persist: Node = null!

    protected onLoad(): void {
        // 创建持久根节点
        this.persist = new Node("PersistNode");
        director.addPersistRootNode(this.persist);

        // 创建游戏界面管理对象
        app.gui = new LayerManager();
       
    }

    /** 初始化配置 */
    initConfig(config:any){
        //配置存储初始化
        app.config = new ConfigManager(config);

        // 设置默认资源包
        // app.res.init(config.packages);

        // 创建音频模块
        app.audio = this.persist.addComponent(AudioManager);
        app.audio.load();

        // 游戏界面管理
        app.gui.mobileSafeArea = app.config.mobileSafeArea;
        
        app.gui.initLayer(this.node, config.uiConfig);

        // 游戏显示事件
        game.on(Game.EVENT_SHOW, this.onShow, this);
        // 游戏隐藏事件
        game.on(Game.EVENT_HIDE, this.onHide, this);
        window.addEventListener('resize', this.initScreenAdapter.bind(this));
        this.initUi();
    }

    /** 初始化游戏界面 */ 
    protected initUi(){
        //需要重写
    }
    
    private onShow() {
        director.resume();              // 恢复暂停场景的游戏逻辑，如果当前场景没有暂停将没任何事情发生
        game.resume();                  // 恢复游戏主循环。包含：游戏逻辑，渲染，事件处理，背景音乐和所有音效
        app.event.dispatchEvent("GAME_SHOW");
    }

    private onHide() {
        director.pause();              // 暂停正在运行的场景，该暂停只会停止游戏逻辑执行，但是不会停止渲染和 UI 响应。 如果想要更彻底得暂停游戏，包含渲染，音频和事件
        game.pause();                  // 暂停游戏主循环。包含：游戏逻辑、渲染、输入事件派发（Web 和小游戏平台除外）
        app.event.dispatchEvent("GAME_HIDE");
    }

    /** 初始化屏幕适配 */
    private initScreenAdapter() {
        const drs = view.getDesignResolutionSize();
        const gameDiv = game.canvas.parentElement;
        // 目标宽高比（750x1334）
        const targetRatio = drs.width / drs.height;
        // 当前屏幕的宽高比
        const currentRatio = gameDiv.clientWidth / gameDiv.clientHeight;
        // 判断适配策略
        if (currentRatio > targetRatio) {
            const w = drs.width * targetRatio
            // 当前屏幕的宽高比大于目标宽高比，进行宽度适配
            view.setDesignResolutionSize(750, 1334, ResolutionPolicy.FIXED_HEIGHT);
        } else {
            // 当前屏幕的宽高比小于目标宽高比，高度适配
            view.setDesignResolutionSize(750, 1334, ResolutionPolicy.FIXED_WIDTH);
        }
    }
}



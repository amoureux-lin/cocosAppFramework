import { AudioManager } from "./Core/Managers/audio/AudioManager";
import { ConfigManager } from "./Core/Managers/ConfigManager";
import { dataManager } from "./Core/Managers/DataManager";
import { eventManager } from "./Core/Managers/EventManager";
import { logManager } from "./Core/Managers/LogManager";
import NodePool from "./Core/Managers/NodePool";
import { queryManager } from "./Core/Managers/QueryManager";
import { resManager } from "./Core/Managers/ResManager";
import { storageManager } from "./Core/Managers/StorageManager";
import { timeManager } from "./Core/Managers/TimeManager";
import { ObjectUtil, randomUtils, StringUtil } from "./Core/Utils";
import { LayerManager } from "./gui/layer/LayerManager";

export class Framework{
    /**日志 */
    public log = logManager;

    /** 配置管理 */
    public config:ConfigManager;

    /**URL地址解析 */
    public query = queryManager;

    /** 音频管理 */
    public audio:AudioManager;

    /** 事件管理 */
    public event = eventManager;

    /** 时间管理 */
    public time = timeManager;

    /** 数据管理 */
    public data = dataManager;

    /** 资源管理 */
    public res = resManager;

    /** 本地存储 */
    public storage = storageManager;

    /** 二维界面管理 */
    public gui:LayerManager;

    /**@description 对象池管理器 */
    get nodePool() {
        return NodePool;
    }

    /** 工具类 */
    public stringUtil = StringUtil;
    public randomUtil = randomUtils;
    public objectUtil = ObjectUtil;

}


/** 全局 Window 接口 */
declare global {
    interface Window {
        app: Framework;
    }
    const app: Framework;
}

/** 创建 Core 类的实例并赋值给全局 window 对象 */
window.app = new Framework();
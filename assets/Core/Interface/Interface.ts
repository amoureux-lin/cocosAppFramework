export interface IStorageSecurity {
    decrypt(str: string): string;
    encrypt(str: string): string;
    encryptKey(str: string): string;
}


/**
 * 全局事件监听方法
 * @param event      事件名
 * @param args       事件参数
 */
export type ListenerFunc = (event: string, ...args: any) => void;

/** 屏幕适配类型 */
export enum ScreenAdapterType {
    /** 自动适配 */
    Auto,
    /** 横屏适配 */
    Landscape,
    /** 竖屏适配 */
    Portrait
}

/** 界面层类型 */
export enum LayerType {
    /** 二维游戏层 */
    Game = "LayerGame",
    /** 主界面层 */
    UI = "LayerUI",
    /** 弹窗层 */
    PopUp = "LayerPopUp",
    /** 模式窗口层 */
    Dialog = "LayerDialog",
    /** 系统触发模式窗口层 */
    System = "LayerSystem",
    /** 消息提示层 */
    Notify = "LayerNotify",
    /** 新手引导层 */
    Guide = "LayerGuide"
}

/** 界面层组件类型 */
export enum LayerTypeCls {
    /** 主界面层 */
    UI = "UI",
    /** 弹窗层 */
    PopUp = "PopUp",
    /** 模式窗口层 */
    Dialog = "Dialog",
    /** 消息提示层 */
    Notify = "Notify",
    /** 自定义节点层 */
    Node = "Node"
}

export interface UIConfig {
    /** 是否为自动生成的界面编号 */
    auto?: boolean,
    /** -----公共属性----- */
    /** 远程包名 */
    bundle?: string;
    /** 窗口层级 */
    layer: string;
    /** 预制资源相对路径 */
    prefab: string;
    /** 是否自动施放（默认不自动释放） */
    destroy?: boolean;

    /** -----弹窗属性----- */
    /** 是否触摸非窗口区域关闭（默认关闭） */
    vacancy?: boolean,
    /** 是否打开窗口后显示背景遮罩（默认关闭） */
    mask?: boolean;
    /** 是否启动真机安全区域显示 */
    safeArea?: boolean;
    /** 界面弹出时的节点排序索引 */
    siblingIndex?: number;
}
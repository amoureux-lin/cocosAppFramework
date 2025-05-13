import { LayerType, UIConfig } from "db://framework/Core/Interface/Interface";

/** 界面唯一标识（方便服务器通过编号数据触发界面打开） */
export enum UIID {
    /** 提示弹出窗口 */
    Alert = 1,
    /** 确认弹出窗口 */
    Confirm,

    /** 资源加载界面 */
    Loading,
    /** Main */
    Main
}

/** 打开界面方式的配置数据 */
export var CommonUIData: { [key: number]: UIConfig } = {
    [UIID.Alert]: { layer: LayerType.Dialog, prefab: "common/prefab/alert",mask: true },
    [UIID.Confirm]: { layer: LayerType.Dialog, prefab: "common/prefab/confirm",mask: true },
}

/** 打开界面方式的配置数据 */
export var GameUIData: { [key: number]: UIConfig } = {
    [UIID.Loading]: { layer: LayerType.UI, prefab: "ui/loading",bundle:'dropBall'},
    [UIID.Main]: { layer: LayerType.UI, prefab: "ui/main",bundle:'dropBall'},
}

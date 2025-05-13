import { Color } from "cc";
import { LayerType, UIConfig } from "db://framework/Core/Interface/Interface";

/** 界面唯一标识（方便服务器通过编号数据触发界面打开） */
export enum DropBallUIID {
    /** 提示弹出窗口 */
    Personal = 1000,
    BottomPannel,
}


/** 打开界面方式的配置数据 */
export var GameUIData: { [key: number]: UIConfig } = {
    [DropBallUIID.Personal]: { layer: LayerType.PopUp, prefab: "ui/personal",bundle:'dropBall',mask:true,vacancy:true},
    [DropBallUIID.BottomPannel]: { layer: LayerType.UI, prefab: "ui/bottomPannel",bundle:'dropBall',mask:false,vacancy:true},
}

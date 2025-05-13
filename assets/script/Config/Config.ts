export const config = {
    localDataKey:"",
    localDataIv:"",
    /** 加载界面资源超时提示 */
    loadingTimeoutGui:10000,
    /** 是否开启移动设备安全区域适配 */
    mobileSafeArea:true,

    /** UI类型配置 */
    uiConfig:[
        { "name": "LayerGame", "type": "Node" },
        { "name": "LayerUI", "type": "UI" },
        { "name": "LayerPopUp", "type": "PopUp" },
        { "name": "LayerDialog", "type": "Dialog" },
        { "name": "LayerSystem", "type": "Dialog" },
        { "name": "LayerNotify", "type": "Notify" },
        { "name": "LayerGuide", "type": "Node" }
    ],
    packages: {
        dropBall: ""
    }
}
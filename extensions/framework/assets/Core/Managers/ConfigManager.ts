
/* 游戏配置解析，对应 resources/config/config.json 配置 */
export class ConfigManager{

    /** 本地存储内容加密 key */
    get localDataKey(): string {
        return this._data.localDataKey;
    }
    /** 本地存储内容加密 iv */
    get localDataIv(): string {
        return this._data.localDataIv;
    }

    /** 加载界面资源超时提示 */
    get loadingTimeoutGui(): number {
        return this._data.loadingTimeoutGui || 1000;
    }

    /** 是否开启移动设备安全区域适配 */
    get mobileSafeArea(): boolean {
        return this._data.mobileSafeArea || false;
    }

    private readonly _data: any = null;
    /** 游戏配置数据 */
    get data(): any {
        return this._data;
    }

    constructor(config: any) {
        this._data = Object.freeze(config);

        app.log.info(this._data, "游戏配置");
    }
}

/** 数据管理器实例 */
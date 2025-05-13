type DeviceInfo = {
    clientType?: string;
    clientIp?: string;
    userAgent?: string;
};

type IConfig = {
    api_url?: string;
    ws_url?: string;
};

declare interface ModuleClass<T> {
	new(): T;
	/**@description 模块名 */
	module: string;
}

/**@description 单列类型限制 */
declare interface SingletonClass<T> extends ModuleClass<T> {
	instance?: T;
}

/**
 * @description 单列接口类
 */
declare interface ISingleton {
	/**@description 初始化 */
	init?(...args: any[]): any;
	/**@description 销毁(单列销毁时调用) */
	destory?(...args: any[]): any;
	/**@description 清理数据 */
	clear?(...args: any[]): any;
	/**@description 是否常驻，即创建后不会删除 */
	isResident?: boolean;
	/**@description 不用自己设置，由单列管理器赋值 */
	module: string;
	/**输出调试信息 */
	debug?(...args: any[]): void;
}

declare function dispatch(name: string, ...args: any[]): void;
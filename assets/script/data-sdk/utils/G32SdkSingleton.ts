import { SingletonT } from "./G32SdkSingletonT";

/**
 * @description 单列管理
 */
export class G32SdkSingleton extends SingletonT<ISingleton> implements ISingleton {
    module: string = "【单列管理器】";
    private static _instance: G32SdkSingleton = null!;
    private static get instance() { return this._instance || (this._instance = new G32SdkSingleton()); }
    /**
     * @description 获取数据
     * @param typeOrkey 具体数据的实现类型或key
     * @param isCreate 
     */
    public static get<T extends ISingleton>(typeOrkey: SingletonClass<T> | string, isCreate: boolean = true,...args:any[]): T | null {
        return this.instance.get(typeOrkey, isCreate,...args);
    }
    /**
    * @description 销毁
    * @param typeOrkey 如果无参数时，则表示销毁所有不常驻的单例
    */
    public static destory<T extends ISingleton>(typeOrkey?: SingletonClass<T> | string) {
        return this.instance.destory(typeOrkey);
    }
    /**
     * @description 销毁
     * @param exclude 需要排除的项,如无参数传入，直接销毁所有
     */
    public static destoryExclude<T extends ISingleton>(exclude?: (SingletonClass<T> | string)[]){
        return this.instance.destoryExclude(exclude);
    }
    /**
     * @description 清空数据
     * @param exclude 排除项
     */
    public static clear<T extends ISingleton>(exclude?: (SingletonClass<T> | string)[]) {
        this.instance.clear(exclude);
    }

    public static debug(){
        this.instance.debug();
    }
}
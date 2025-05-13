
/** 
 * 数据管理器
 * 提供数据的存储、读取（支持文本、数字、JSON）功能。
 */
class DataManager {
    /** 私有构造函数，确保外部无法直接通过new创建实例 */
    private constructor() {}

    /** 单例实例 */
    public static readonly instance: DataManager = new DataManager();

    public  data:any = null;

    
}

/** 数据管理器实例 */
export const dataManager = DataManager.instance;

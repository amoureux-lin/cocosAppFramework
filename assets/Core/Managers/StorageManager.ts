import { sys } from "cc";
import { JsonUtil } from "../Utils/JsonUtil";
import { logManager } from "./LogManager";
import { CryptUtil } from "../Utils/CryptUtil";

/** 
 * 本地存储 
 */
class StorageManager {

    /** 私有构造函数，确保外部无法直接通过new创建实例 */
    private constructor() {}

    /** 单例实例 */
    public static readonly instance: StorageManager = new StorageManager();

    /**
         * 存储数据
         * @param key 数据键
         * @param value 数据值，可以是文本、数字或对象
         */
        public set(key: string, value: any): void {
            const stringValue = typeof value === "object" ? JsonUtil.stringify(value) : value.toString();
            const encryptedValue = CryptUtil.strEncrypt(stringValue, 'dataKey');
    
            try {
                sys.localStorage.setItem(key, encryptedValue);
            } catch (error) {
                logManager.error(`数据存储失败: ${key}`, error.message);
            }
        }
    
        /**
         * 读取文本数据
         * @param key 数据键
         * @returns 返回对应键的数据值
         */
        public getText(key: string): string | null {
            try {
                const encryptedValue = sys.localStorage.getItem(key);
                if (encryptedValue) {
                    return CryptUtil.strDecrypt(encryptedValue, 'dataKey');
                }
                return null;
            } catch (error) {
                logManager.error(`文本数据读取失败: ${key}`, error.message);
                return null;
            }
        }
    
        /**
         * 读取数字数据
         * @param key 数据键
         * @returns 返回对应键的数字值
         */
        public getNumber(key: string): number | null {
            const textValue = this.getText(key);
            if (textValue) {
                const numberValue = Number(textValue);
                return isNaN(numberValue) ? null : numberValue;
            }
            return null;
        }
    
        /**
         * 读取JSON数据
         * @param key 数据键
         * @returns 返回对应键的对象
         */
        public getJSON(key: string): any | null {
            const textValue = this.getText(key);
            if (textValue) {
                return JsonUtil.parse(textValue);
            }
            return null;
        }
    
        /**
         * 删除数据
         * @param key 数据键
         */
        public removeData(key: string): void {
            sys.localStorage.removeItem(key);
        }
    
        /** 清空所有数据 */
        public clearAllData(): void {
            sys.localStorage.clear();
        }
}

export const storageManager = StorageManager.instance;
import { ListenerFunc } from "../Interface/Interface";
import { logManager } from "./LogManager";
/**
 * 事件管理器
 * 该类用于管理事件的注册、触发和注销。
 */
class EventManager {

    /** 私有构造函数，确保外部无法直接通过new创建实例 */
    private constructor() {}

    /** 单例实例 */
    public static readonly instance: EventManager = new EventManager();
    /** 
     * 全局消息管理
     * @example 
     */
    private events: Map<string, Array<EventData>> = new Map();

    /**
     * 注册全局事件
     * @param event      事件名
     * @param object     侦听函数绑定的作用域对象
     */
    on(event: string, object: any) {
        let listener:ListenerFunc = object.onHandler;
        if (!event || !listener) {
            
            logManager.warn(`注册【${event}】事件的侦听器函数【onHandler】为空`);
            return;
        }

        let eds = this.events.get(event);
        if (eds == null) {
            eds = [];
            this.events.set(event, eds);
        }

        let length = eds.length;
        for (let i = 0; i < length; i++) {
            let bin = eds[i];
            if (bin.listener == listener && bin.object == object) {
                logManager.warn(`名为【${event}】的事件重复注册侦听器`);
            }
        }


        let data: EventData = new EventData();
        data.event = event;
        data.listener = listener;
        data.object = object;
        eds.push(data);
    }

    /**
     * 监听一次事件，事件响应后，该监听自动移除
     * @param event     事件名
     * @param object    侦听函数绑定的作用域对象
     */
    once(event: string, object: any) {
        let listener:ListenerFunc = object.onHandler;
        let _listener: any = ($event: string, ...$args: any) => {
            this.off(event, object);
            _listener = null;
            listener.call(object, $event, $args);
        }
        this.on(event,object);
    }

    /**
     * 移除全局事件
     * @param event     事件名
     * @param object    侦听函数绑定的作用域对象
     */
    off(event: string, object: any) {
        let listener:ListenerFunc = object.onHandler;
        let eds = this.events.get(event);

        if (!eds) {
            logManager.warn(`名为【${event}】的事件不存在`);
            return;
        }

        let length = eds.length;
        for (let i = 0; i < length; i++) {
            let bin: EventData = eds[i];
            if (bin.listener == listener && bin.object == object) {
                eds.splice(i, 1);
                break;
            }
        }

        if (eds.length == 0) {
            this.events.delete(event);
        }
    }

    /** 
     * 触发全局事件 
     * @param event(string)      事件名
     * @param args(any)          事件参数
     */
    dispatchEvent(event: string, ...args: any) {
        let list = this.events.get(event);

        if (list != null) {
            let eds: Array<EventData> = list.concat();
            let length = eds.length;
            for (let i = 0; i < length; i++) {
                let eventBin = eds[i];
                eventBin.listener.call(eventBin.object, event, ...args);
            }
        }
    }

    /**
     * 分发js事件到html
     * @param event 
     * @param args 
     */
    dispathJsEvent(event: string, ...args: any){
        window.dispatchEvent(new CustomEvent(event, args));
    }
}
class EventData {
    public event!: string;
    public listener!: ListenerFunc;
    public object: any;
}

/** 事件管理器实例 */
export const eventManager = EventManager.instance;

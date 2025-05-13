/**
 * @description 事件处理组件
 */

import { Component, Node, NodeEventType, _decorator, __private } from "cc";
import { IEventProcessor, EventAgrs, EventProcessor, EventCallback } from "./G32SdkEventProcessor";

const { ccclass, property } = _decorator;

@ccclass("EventComponent")
export default class G32SdkEventComponent extends Component implements IEventProcessor {

    private _eventProcessor = new EventProcessor;
    /**@description  默认Dispatcher消息*/
    protected _msgDKeys: string[] = [];
    
    on(args: EventAgrs): void {
        if (!args.target) {
            args.target = this;
        }
        if(args.bind === "Dispatcher") {
            // 默认 onReceive
            if(!args.cb) {
                args.cb = this.onReceive;
            }
        }
        this._eventProcessor.on(args);
    }
    once(args: EventAgrs): void {
        if (!args.target) {
            args.target = this;
        }
        if(args.bind === "Dispatcher") {
            // 默认 onReceive
            if(!args.cb) {
                args.cb = this.onReceive;
            }
        }
        this._eventProcessor.once(args);
    }
    off(args: EventAgrs): void {
        if (!args.target) {
            args.target = this;
        }
        this._eventProcessor.off(args);
    }

    onD(eventName: string[]|string, func?: EventCallback): void {
        let events:string[];
        if(typeof eventName == "string"){
            events = [eventName];
        }else{
            events = eventName;
        }
        if(events && events.length > 0){
            for (let index = 0; index < events.length; index++) {
                this.on({
                    bind: "Dispatcher",
                    type: events[index],
                    cb: func,
                });
            }
        }
    }

    onceD(eventName: string[], func?: EventCallback): void {
        if(eventName && eventName.length > 0){
            for (let index = 0; index < eventName.length; index++) {
                this.once({
                    bind: "Dispatcher",
                    type: eventName[index],
                    cb: func,
                });
            }
        }
    }

    offD(eventName: string[]): void {
        if(eventName && eventName.length > 0){
            for (let index = 0; index < eventName.length; index++) {
                this.off({
                    bind: "Dispatcher",
                    type: eventName[index],
                });
            }
        }
    }

    onG(type: string, cb: EventCallback): void {
        this.on({
            bind: "Game",
            type: type,
            cb: cb
        })
    }
    onceG(type: string, cb: EventCallback): void {
        this.once({
            bind: "Game",
            type: type,
            cb: cb
        });
    }
    offG(type: string, cb: EventCallback): void {
        this.off({
            bind: "Game",
            type: type,
            cb: cb
        });
    }

    onI<K extends keyof __private._cocos_input_input__InputEventMap>(eventType: K, cb: EventCallback): void {
        this.on({
            bind: "Input",
            type: eventType,
            cb: cb
        })
    }
    onceI<K extends keyof __private._cocos_input_input__InputEventMap>(eventType: K, cb: EventCallback): void {
        this.once({
            bind: "Input",
            type: eventType,
            cb: cb
        })
    }
    offI<K extends keyof __private._cocos_input_input__InputEventMap>(eventType: K, cb: EventCallback): void {
        this.off({
            bind: "Input",
            type: eventType,
            cb: cb
        })
    }

    onN(node: Node, type: string | NodeEventType, cb: EventCallback, target?: unknown, useCapture?: any): void {
        this.on({
            bind:"Node",
            type:type,
            cb:cb,
            target : target,
            useCapture : useCapture,
            node : node
        })
    }
    onceN(node: Node, type: string | NodeEventType, cb: EventCallback, target?: unknown, useCapture?: any): void {
        this.once({
            bind:"Node",
            type:type,
            cb:cb,
            target : target,
            useCapture : useCapture,
            node : node
        })
    }
    offN(node: Node, type: string | NodeEventType, cb: EventCallback, target?: unknown, useCapture?: any): void {
        this.off({
            bind:"Node",
            type:type,
            cb:cb,
            target : target,
            useCapture : useCapture,
            node : node
        })
    }

    addEvents() {

    }

    /**默认type = arguments[0]*/
    onReceive(...any: any[]) : void{

    }

    /** 子函数必须在此初始化消息, 否则需要动态自动进行注册 */
    initMsgKeys(keys:string[]){

    }

    onLoad() {
        this.initMsgKeys(this._msgDKeys);
        this.onD(this._msgDKeys);
        this.addEvents();
    }

    onDestroy() {
        this._eventProcessor.onDestroy();
    }
}

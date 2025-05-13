import { EventProcessor } from "../utils/G32SdkEventProcessor";
import { G32Log } from "../utils/G32Log";
import { HttpCallback, HttpRequest, QResult, URLRequestMethod } from "./HttpRequest";

export class HttpManager implements ISingleton{

	protected Tag: string = "";

	isResident?: boolean = true;
    static module: string = "【Http管理器】";
    module: string = null!;

    protected static _instance: HttpManager = null!;
    public static get instance() { return this._instance || (this._instance = new HttpManager()); }

    init(...args: any[]) {
       
    }

    destory(...args: any[]) {
        
    }

	private host!: string;
	/** 当前盘口id */
	public betLimitRuleGroupId:string; 
	/** 当前房间id */
	public gameRoomId:string;

	constructor() {
		this.Tag = "HTTP:";
		this.host = "";
	}

	public requestWithGet(param: QParam, tag?: number) {
		let url = this.host + param.path() + param.getQuery();
		let body = param;
		let msgCallBack = new MsgCallBack(param.msgKey(), tag);
		this.request(url, URLRequestMethod.GET, body, msgCallBack, "json", true, true);
	}

    public requestWithPost(param: QParam, tag?: number) {
		let url = this.host + param.path() + param.getQuery();
		let body = param;
		let msgCallBack = new MsgCallBack(param.msgKey(), tag);
		this.request(url, URLRequestMethod.POST, JSON.stringify(body), msgCallBack, "json", true, true);
	}

	public requestWithPut(param: QParam, tag?: number) {
		let url = this.host + param.path() + param.getQuery();
		let body = param;
		let msgCallBack = new MsgCallBack(param.msgKey(), tag);
		this.request(url, URLRequestMethod.PUT, JSON.stringify(body), msgCallBack, "json", true, true);
	}

	private request(url: string, type: string, data: any, callback: HttpCallback, ctype: string = "xml", cros?: boolean, jt: boolean = false) {
		let loader: HttpRequest = new HttpRequest();
		let heads: any[] = [];

		if (data != null) {
			// heads.push({"Content-Type":"text/"+ctype});
		}

		if (cros) {
			heads.push({ "Content-Type": "application/" + (jt ? ctype : "x-www-form-urlencoded") + ";charset=UTF-8" });
		}

		heads.push({"Game-Room-Id":this.gameRoomId});
		heads.push({"Limit-Rule-Group-Id":this.betLimitRuleGroupId});

		if (type == URLRequestMethod.GET) {
			loader.getWithParams(url, data, callback.postComplete.bind(callback), callback.postError.bind(callback), heads);
		} else if (type == URLRequestMethod.POST) {
			loader.post(url, data, callback.postComplete.bind(callback), callback.postError.bind(callback), heads, callback);
		} else if(type == URLRequestMethod.PUT) {
			loader.put(url, data, callback.postComplete.bind(callback), callback.postError.bind(callback), heads, callback);
		}

	}
}

//////////////////////////////////////////////////////////////////////
export class MsgCallBack extends EventProcessor implements HttpCallback {

	private msgKey!: string;
	private timeoutId!: number;
	private isTimeout!: boolean;
	private tag?: number;

	constructor(key: string, tag?: number) {
		super();
		this.msgKey = key;
		this.tag = tag;
		this.timeoutId = setTimeout(() => {
			this.timeout()
		}, 10000);
	}

	timeout() {
		this.isTimeout = true;
		this.timeoutId = 0;
		G32Log.w("http timeout:" + this.msgKey);
		dispatch(this.msgKey, null, -1);
	}

	postComplete(data: any) {
		clearTimeout(this.timeoutId);
		this.timeoutId = -1;
		if (this.isTimeout) {
			return;
		}
		try {
			let result: QResult = data;
			dispatch(this.msgKey, result.result, result.code, this.tag);
		} catch (e) {
			G32Log.e("http postComplete:" + e);
		}
	}
	postError(data: any) {
		clearTimeout(this.timeoutId);
		this.timeoutId = -1;
		if (this.isTimeout) {
			return;
		}
		dispatch(this.msgKey, data, data.code, this.tag, data.msg);
	}
}

//////////////////////////////////////////////////////////////////////
export abstract class QParam {

	constructor() {
		this.init();
	}

	protected init() {
		
	}

	public getQuery() {
		return "";
	}

	public getPostBody() {
		return JSON.stringify(this);
	}

	path(): string {
		return "";
	}

	abstract msgKey(): string;
}
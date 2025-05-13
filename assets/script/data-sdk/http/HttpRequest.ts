import { DEBUG } from "cc/env";
import { Config } from "../config/Config";
import { G32Log } from "../utils/G32Log";
import { Utils } from "../utils/Utils";

var urls: any = {};                      // 当前请求地址集合
var reqparams: any = {};                 // 请求参数

/** 统一结果 */
export class QResult {
    code: number | undefined;
    result: any;
    error?: string;
}

export interface HttpCallback {
    postComplete(data:any):void;
    postError(data:any):void;
}

export enum HttpEvent {
    NO_NETWORK = "http_request_no_network",                  // 断网
    UNKNOWN_ERROR = "http_request_unknown_error",            // 未知错误
    TIMEOUT = "http_request_timout"                          // 请求超时
}

export enum URLRequestMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT"
}

export class HttpRequest {
    /** 服务器地址 */
    public server: string = "http://localhost:3000/";

    // public prefix: string = "v1/";
    /** api前缀 */
    public prefix(){
        if(DEBUG){
            return "api/v1/";
        }else{
            return "v1/";
        }
    }
    /** 请求超时时间 */
    public timeout: number = 10000;

    public static authorization = "";
    public static deviceId = "";

    constructor() {
        this.server = Config.api_url + "/";
    }

    public get(name: string, completeCallback: Function, errorCallback: Function, heads?: any[]): XMLHttpRequest | null {
        return this.sendRequest(name, null, URLRequestMethod.GET, completeCallback, errorCallback, heads)
    }

    public getWithParams(name: string, params: any, completeCallback: Function, errorCallback: Function, heads?: any[]): XMLHttpRequest | null {
        return this.sendRequest(name, params, URLRequestMethod.GET, completeCallback, errorCallback, heads)
    }

    public getByArraybuffer(name: string, completeCallback: Function, errorCallback: Function, heads?: any[]): XMLHttpRequest | null {
        return this.sendRequest(name, null, URLRequestMethod.GET, completeCallback, errorCallback, undefined, heads, 'arraybuffer', false);
    }
    public getWithParamsByArraybuffer(name: string, params: any, completeCallback: Function, errorCallback: Function, heads?: any[]): XMLHttpRequest | null {
        return this.sendRequest(name, params, URLRequestMethod.GET, completeCallback, errorCallback, undefined, heads, 'arraybuffer', false);
    }

    public post(name: string, params: any, completeCallback?: Function, errorCallback?: Function, headers?: any[], callObj?: any): XMLHttpRequest | null {
        return this.sendRequest(name, params, URLRequestMethod.POST, completeCallback, errorCallback, headers, callObj);
    }

    public put(name: string, params: any, completeCallback?: Function, errorCallback?: Function, headers?: any[], callObj?: any): XMLHttpRequest | null {
        return this.sendRequest(name, params, URLRequestMethod.PUT, completeCallback, errorCallback, headers, callObj);
    }

    /** 取消请求中的请求 */
    public abort(name: string) {
        var xhr = urls[this.server + this.prefix() + name];
        if (xhr) {
            xhr.abort();
        }
    }

    /**
     * 获得字符串形式的参数
     */
    private getParamString(params: any) {
        var result = "";
        for (var name in params) {
            let data = params[name];
            if (data instanceof Object) {
                for (var key in data)
                    result += `${key}=${data[key]}&`;
            }
            else {
                result += `${name}=${data}&`;
            }
        }

        return result.substr(0, result.length - 1);
    }

    /** 
     * Http请求 
     * @param name(string)              请求地址
     * @param params(JSON)              请求参数
     * @param method(string)            POST PUT GET
     * @param callback(function)        请求成功回调
     * @param errorCallback(function)   请求失败回调
     * @param responseType(string)      响应类型
     */
    private sendRequest(name: string,
        params: any,
        method: string,
        completeCallback?: Function,
        errorCallback?: Function,
        headers?: any[],
        callObj?: any,
        responseType?: string,
        isOpenTimeout = true,
        timeout: number = this.timeout): XMLHttpRequest | null {
        if (name == null || name == '') {
            G32Log.e("请求地址不能为空");
            return null;
        }

        var url: string, newUrl: string, paramsStr: string;
        if (name.toLocaleLowerCase().indexOf("http") == 0) {
            url = name;
        }
        else {
            url = this.server + this.prefix() + name;
        }

        if (params) {
            paramsStr = this.getParamString(params);
            if (paramsStr.length > 0) {
                if (url.indexOf("?") > -1)
                    newUrl = url + "&" + paramsStr;
                else
                    newUrl = url + "?" + paramsStr;
            } else {
                newUrl = url;
            }
        } else {
            newUrl = url;
        }

        if (method == URLRequestMethod.GET && urls[newUrl] != null && reqparams[newUrl] == paramsStr!) {
            G32Log.w(`地址【${url}】已正在请求中，不能重复请求`);
            if (errorCallback) errorCallback.call(callObj, {code:-1});
            return null;
        }

        var xhr = new XMLHttpRequest();

        // 防重复请求功能
        urls[newUrl] = xhr;
        reqparams[newUrl] = paramsStr!;

        if (method == URLRequestMethod.POST || method == URLRequestMethod.PUT) {
            xhr.open(method, url);
        } else {
            xhr.open(URLRequestMethod.GET, newUrl);
        }

        if (headers && headers.length > 0) {
            let header: any;
            let len: number = headers.length;
            for (let i: number = 0; i < len; i++) {
                header = headers[i];
                for (let key in header) {
                    xhr.setRequestHeader(key, header[key]);
                }
            }
        }
        xhr.setRequestHeader("Request-Id", Utils.generateUUID());
        xhr.setRequestHeader("Nonce", String(new Date().getTime()));
        xhr.setRequestHeader("Timestamp", String(new Date().getTime()));
        if (HttpRequest.authorization.length > 0) {
            xhr.setRequestHeader("authorization", HttpRequest.authorization);
        }
        if (!HttpRequest.deviceId) {
            HttpRequest.deviceId = Utils.getDeviceId();
        }
        xhr.setRequestHeader("DEVICE-ID", HttpRequest.deviceId);
        // xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        // xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");

        var data: any = {};
        data.url = url;
        data.params = params;

        // 请求超时
        if (isOpenTimeout) {
            xhr.timeout = timeout;
            xhr.ontimeout = () => {
                this.deleteCache(newUrl);

                data.error = HttpEvent.TIMEOUT;
                data.code  = -1;

                if (errorCallback) errorCallback.call(callObj, data);
            }
        }

        xhr.onloadend = (a) => {
            if (xhr.status == 500) {
                this.deleteCache(newUrl);

                if (errorCallback == null) return;

                data.error = HttpEvent.NO_NETWORK;          // 断网
                data.code  = -1;

                if (errorCallback) errorCallback.call(callObj, data);
            }
        }

        xhr.onerror = () => {
            this.deleteCache(newUrl);

            if (errorCallback == null) return;

            if (xhr.readyState == 0 || xhr.readyState == 1 || xhr.status == 0) {
                data.error = HttpEvent.NO_NETWORK;          // 断网 
            }
            else {
                data.error = HttpEvent.UNKNOWN_ERROR;       // 未知错误
            }

            data.code = -1;

            if (errorCallback) errorCallback.call(callObj, data);
        };

        xhr.onreadystatechange = () => {
            if (xhr.readyState != 4) return;

            this.deleteCache(newUrl);

            if (xhr.status == 200) {
                if (completeCallback) {
                    if (responseType == 'arraybuffer') {
                        // 加载非文本格式
                        xhr.responseType = responseType;
                        if (completeCallback) completeCallback.call(callObj, xhr.response);
                    }
                    else {
                        // 加载非文本格式
                        let data: any;
                        try {
                            data = JSON.parse(xhr.response);
                        } catch (e) {
                            data = {};
                            data.code = -2;
                            data.error = xhr.response;
                            if (errorCallback) errorCallback.call(callObj, data);
                            return;
                        }

                        if (data.code != null) {
                            /** 服务器错误码处理 */
                            if (data.code == 0) {
                                let q: QResult = new QResult();
                                q.code = data.code;
                                if (data.result) {
                                    q.result = data.result;
                                } else if (data.data) {
                                    q.result = data.data;
                                }
                                const auth = xhr.getResponseHeader("authorization");
                                if (auth) {
                                    HttpRequest.authorization = auth;
                                }

                                if (completeCallback) completeCallback.call(callObj, q);
                            }
                            else {
                                if (errorCallback) errorCallback.call(callObj, data);
                            }
                        }
                        else {
                            data.code = -3;
                            if (completeCallback) completeCallback.call(callObj, data);
                        }
                    }
                }
            }else
            if(xhr.status == 400){
                // bad Request
                let data1: any = {};
                try {
                    data1 = JSON.parse(xhr.response);
                } catch (e) {
                    data1.code = -400;
                    data1.error = xhr.response;
                    if (errorCallback) errorCallback.call(callObj, data1);
                    return;
                }
                if (errorCallback) errorCallback.call(callObj, data1);
            }
        };

        if (params == null || params == "") {
            xhr.send();
        } else {
            xhr.send(params!);// 根据服务器接受数据方式做选择
        }

        return xhr;
    }

    private deleteCache(url: string) {
        delete urls[url];
        delete reqparams[url];
    }
}
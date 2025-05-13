/**
 * Http 工具集
 */
export declare function unescape(str:any):any;

export class Utils {
	/** 获取地址栏参数 */
	static getUrlParam(name:string):any{
  		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  		var r = window.location.search.substr(1).match(reg);
  		if(r != null){ return unescape(r[2]);}
  		return null;
	}

	static getDeviceId() {
		let deviceId = localStorage?.getItem('device_id');
		if (!deviceId) {
			deviceId = Utils.generateUUID();
			localStorage?.setItem('device_id', deviceId);
		}
		return deviceId;
	}
	
	// 生成 UUID
	static generateUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			const r = (Math.random() * 16) | 0;
			const v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	
    static parseUrlParams() {
        var n = window.location.href;
        var t = n.indexOf("?");
        var r = -1 == t ? "" : n.substring(t + 1).replace(/\+/g, "%20");
        var i = r.split("&");
        var a: any = {};
        var o = 0;
        for (; o < i.length; o++) {
            var c = i[o].split("=");
            var u = decodeURIComponent(c[0] || "");
            var l = decodeURIComponent(c[1] || "");
            if (u && l) {
                if (void 0 === a[u]) {
                    a[u] = l;
                } else {
                    if ("object" == typeof a[u]) {
                        a[u].push(l);
                    } else {
                        a[u] = [a[u], l];
                    }
                }
            }
        }
        return a;
    };

    /**
     * 判断是否是IOS设备
     * @returns boolean
     */
    static isIOS() {
        const u = navigator.userAgent;
        return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X|Macintosh.*Mac OS X/);
    }

    static getDeviceInfo() {
        const { os, browser } = UAParser(window.navigator.userAgent);
        return {
          clientType: Utils.isIOS() ? "IOS" : "Android",
          clientIp: Utils.ipAddress,
          userAgent: window.navigator.userAgent,
          width: window.innerWidth,
          height: window.innerHeight,
          os: os.name,
          browser: browser.name,
          latency: Utils.latency, // 网络延迟
          network: "", // 网络3g,4g,5g等
          isp: "", // 网络运营商
          appVersion: browser.version, // 应用版本号
        };
    }

    static async awaitTo<T, U = Error>(
        promise: Promise<T>,
        errorExt?: object
      ): Promise<[U, undefined] | [null, T]> {
        return promise
          .then<[null, T]>((data: T) => [null, data])
          .catch<[U, undefined]>((err: U) => {
            if (errorExt) {
              const parsedError = Object.assign({}, err, errorExt);
              return [parsedError, undefined];
            }
      
            return [err, undefined];
          });
    }

    private static latency:number = 0;
    static ipAddress:string = "";

    static async getIpAddress() {
        const startTime = Date.now(); // 请求开始
      
        const [err, result] = await this.awaitTo(
          Promise.any([
            fetch("https://www.cloudflare.com/cdn-cgi/trace")
              .then((res) => {
                if (res.status == 200) return res.text();
                throw new Error(`cloudflare error: ${res.status}`);
              })
              .then((data) => {
                const ipMatch = data.match(/ip=(.*)/);
                console.log("ipMatch");
                return { source: "cloudflare", ip: ipMatch ? ipMatch[1] : "" };
              }),
            fetch("https://api.ipify.org?format=json")
              .then((res) => {
                if (res.status == 200) return res.json();
                throw new Error(`ipify error: ${res.status}`);
              })
              .then((data) => ({ source: "ipify", ip: data.ip })),
          ])
        );
        Utils.latency = Date.now() - startTime;
      
        if (err) {
          console.error("Failed to retrieve IP address from all sources:", err);
          return;
        }
        return { ...result };
    }
}

Utils.getIpAddress().then((item) => {
    Utils.ipAddress = item?.ip;
});

function UAParser(userAgent: string): { os: any; browser: any; } {
    return {os: "", browser: ""};
}

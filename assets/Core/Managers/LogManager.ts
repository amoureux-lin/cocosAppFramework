import { log } from "cc";

/**
 * 日志管理器
 * 用于统一日志输出格式
 */
class LogManager {

    // 日志开关
    private static open: boolean = true;

    /**
     * 设置日志开关
     * @param isOpen 是否打开日志
     */
    public static setLogOpen(isOpen: boolean): void {
        if(!isOpen){
            console.log = function(){};
        }
        this.open = isOpen;
    }
    /**
     * 检查日志开关是否打开
     * @returns 是否打开日志
     */
    private static isOpen(): boolean {
        return this.open;
    }

    /**
     * 用于输出调试信息
     */
    static debug(...args: any) {
        this.print('color:#007BFF','视图日志', ...args);
    }

    static info(...args: any){
        this.print('color:green','视图日志', ...args);
    }
    
    /** 打印普通日志 */
    static log(...args: any){
        this.print('color:#3a5fcd','普通日志',...args)
    }

    /** 打印警告日志 */
    static warn(...args: any){
        this.print('color:yellow','警告日志',...args)
    }

    /** 打印错误日志 */
    static error(...args: any){
        this.print('color:red','错误日志',...args)
    }

    private static print(color: string, type:string, ...args: any){
        // 标记没有打开，不打印该日志
        if (!this.isOpen()) {
            return;
        }
        var backLog = console.log || log;
        backLog.call(null, "%c%s%s%s:%o", color, this.getDateString(), '[' + type + ']', this.stack(4), ...args);
    }


    /**日志来源 */
    private static stack(index: number): string {
        var e = new Error();
        var lines = e.stack!.split("\n");
        var result: Array<any> = [];
        lines.forEach((line) => {
            line = line.substring(7);
            var lineBreak = line.split(" ");
            if (lineBreak.length < 2) {
                result.push(lineBreak[0]);
            }
            else {
                result.push({ [lineBreak[0]]: lineBreak[1] });
            }
        });

        var list: string[] = [];
        var splitList: Array<string> = [];
        if (index < result.length - 1) {
            var value: string;
            for (var a in result[index]) {
                var splitList = a.split(".");

                if (splitList.length == 2) {
                    list = splitList.concat();
                }
                else {
                    value = result[index][a];
                    var start = value!.lastIndexOf("/");
                    var end = value!.lastIndexOf(".");
                    if (start > -1 && end > -1) {
                        var r = value!.substring(start + 1, end);
                        list.push(r);
                    }
                    else {
                        list.push(value);
                    }
                }
            }
        }

        if (list.length == 1) {
            return "[" + list[0] + ".ts]";
        }
        else if (list.length == 2) {
            return "[" + list[0] + ".ts/" + list[1] + "]";
        }
        return "";
    }

    /**时间 */
    private static getDateString(): string {
        let d = new Date();
        let str = d.getHours().toString();
        let timeStr = "";
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getMinutes().toString();
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getSeconds().toString();
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getMilliseconds().toString();
        if (str.length == 1) str = "00" + str;
        if (str.length == 2) str = "0" + str;
        timeStr += str;

        timeStr = "[" + timeStr + "]";
        return timeStr;
    }
}

/** 日志管理器实例 */
export const logManager = LogManager

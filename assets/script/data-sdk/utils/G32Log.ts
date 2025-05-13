
export class G32Log {
    static DEBUG: boolean = false;
    static ON_PLANE:boolean = false;
    static LEVEL: number = 6;
    static TEST:boolean = false;

    constructor() {
        // egret.Logger.logLevel = egret.Logger.INFO;  后面修改
    }

    static init(debug:boolean, level:number) {
        G32Log.DEBUG = debug;
        G32Log.LEVEL = level;
    }
    /** fault */
    static f(...data: any[]) {
        G32Log.print(6, ...data);
    }
    /** error */
    static e(...data: any[]) {
        G32Log.print(5, ...data);
    }
    /** warn */
    static w(...data: any[]) {
        G32Log.print(4, ...data);
    }
    /** info */
    static i(...data: any[]) {
        G32Log.print(3, ...data);
    }
    /** log */
    static l(...data: any[]) {
        G32Log.print(2, ...data);
    }
    /** debug */
    static d(...data: any[]) {
        G32Log.print(1, ...data);
    }

    /** 输出调试信息 */
    static D(...data: any[]):void{
        G32Log.print(1, ...data);
    }
    /** 输出日志信息 */
    static L(...data: any[]):void{
        G32Log.print(2, ...data);
    }
    /** 输出提示信息 */
    static I(...data: any[]):void{
        G32Log.print(3, ...data);
    }
    /** 输出警告信息 */
    static W(...data: any[]):void{
        G32Log.print(4, ...data);
    }
    /** 输出异常信息 */
    static E(...data: any[]):void{
        G32Log.print(5, ...data);
    }
    /** 输出致命的错误信息 */
    static F(...data: any[]):void{
        G32Log.print(6, ...data);
    }

    /** 输出调试信息 */
    static debug(...data: any[]):void{
        G32Log.print(1, ...data);
    }
    /** 输出日志信息 */
    static log(...data: any[]):void{
        G32Log.print(2, ...data);
    }
    /** 输出提示信息 */
    static info(...data: any[]):void{
        G32Log.print(3, ...data);
    }
    /** 输出警告信息 */
    static warn(...data: any[]):void{
        G32Log.print(4, ...data);
    }
    /** 输出异常信息 */
    static error(...data: any[]):void{
        G32Log.print(5, ...data);
    }
    
    public static logsArray = [];

    private static print(level:number, ...data: any[]){
        if (G32Log.DEBUG && G32Log.LEVEL < level) {
                switch(level){
                     case 6:
                        console.error(...data);
                        break;
                     case 5:
                        console.error(...data);
                        break;
                     case 4:
                        console.warn(...data);
                        break;
                     case 3:
                        console.info(...data);
                        break;
                     case 2:
                        console.log(...data);
                        break;
                     case 1:
                        console.debug(...data);
                        break;
                }
                G32Log.logsArray.push(...data);   
        }
    }
}

class Utc0 {
    time: string;
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
    second: string;
    millisecond: string;
    timestamp: number;
  
    constructor(date?: number|string | Date) {
        this.time = date ? new Date(date).toISOString() : new Date().toISOString();
        this.year = this.getDay().split("-")[0];
        this.month = this.getDay().split("-")[1];
        this.day = this.getDay().split("-")[2];
        this.hour = this.getTime().split(":")[0];
        this.minute = this.getTime().split(":")[1];
        this.second = this.getMillisecond()[0];
        this.millisecond = this.getMillisecond()[1].substring(0, 3);
        this.timestamp = new Date(this.time).getTime();
    }
  
    private getDay() {
        return this.time.split("T")[0];
    }
  
    private getTime(): string {
        return this.time.split("T")[1];
    }
  
    private getSecond(): string {
        return this.getTime().split(":")[2];
    }
  
    private getMillisecond(): Array<string> {
        return this.getSecond().split(".");
    }
  }
  
  export default Utc0;
  
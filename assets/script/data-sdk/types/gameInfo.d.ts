declare namespace GameInfo {
    //  限注规则
    type LimitRule = {
        currency: string;
        maxAmount: number;
        minAmount: number;
        gameWagerId?: number;
    };

    type AnchorInfo = {
        name: string;
        homeTown: string;
        birthday: string;
        facebook: string;
        liveCount: number;
        id: string;
    };

    type Category = {
        name: string;
        code: number;
    };

    type VideoItem = {
        defaultOn: "Y" | "N";
        resolution: number;
        sort: number;
        videoUrl: string;
    };

    type RoundInfo = {
        id: string;
        roundNo: string;
    };

    type GameWagerInfo = {
        id: string;
        odds: number;
        settleCount: number;
        status: "Enable" | "Maintain" | "Disable";
    };

    type CommandType = { 
        gameRoundId: string; 
        payload: object; 
        command: number 
    };
 
    type Chip = { 
        currency: string; 
        name: string; 
        chip: number ;
        sort: number ;
    };
}

type GameResultInfo = {
    isWin: boolean;//是否输赢
    winner: number,
    count: number,//输赢额度
    winArea: any[],//赢的玩法区
}

type WonRankType = {
    amount: string;
    nickname: string;
};

// 开奖结果类型定义
type DrawResultType = {
    id?: number;
    result: number[];
    gameRoundId: string; // 游戏局ID
    data: {
      dragonPoint?: number;
      tigerPoint?: number;
      playerPoint?: number;
      bankerPoint?: number;
      raw?: {
        diceList?: number[];
        number?: number[];
        dragon?: string[];
        tiger?: string[];
        player?: string[];
        banker?: string[];
      };
    };
  };

type GameInfoRes = {
    limitRule: GameInfo.LimitRule;
    anchor: GameInfo.AnchorInfo;
    category: GameInfo.Category;
    videoList: GameInfo.VideoItem[];
    id: string; // 房间号Id
    round: GameInfo.RoundInfo;
    game: { countdown: number; code: string; id: string;delay: number };
    gameWagerList?: GameInfo.GameWagerInfo[];
    commandList: GameInfo.CommandType[];
    chipList:GameInfo.Chip[];
    kickOutLimit?: number;
    namespace:string;
};

type DynamicOddsType = {
    odds: number;
    game_wager_id: string;
    type: "Dynamic" | "Normal";
};

type BetRateType = {
    rate: number;
    gameWagerId: string;
};
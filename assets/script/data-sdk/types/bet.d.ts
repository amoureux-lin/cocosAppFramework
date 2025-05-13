// 投币区数据类型
type BetAreaData = {
    [gameWagerId: number]: {
        userBetInfo: {
            [userId: string]: { betAmount: number };
        };
    };
};

// 投币日志类型
type BetLogType = {
    logId: string;
    betAmount: number;
    orderNo: string;
    gameWagerId: number;
};

// 用户投币数据类型
type UserBetDataType = {
    [gameWagerId: number]: { betAmount: number };
};

// 投币接口返回的数据数据
type BetResType = {
    gameId: string;
    gameRoomId: string;
    gameRoundNo: string;
    betAmount: number;
    orderNo: string;
    gameWagerId: number;
};

// 用户局投币历史信息
type UserRoundBetType = {
    orderNo: string;
    betAmount: number;
    gameWagerId: number;
};

// 投币区数据统计类型
type BetAreaSatisticsType = {
    betAmountTotal: number; // 投币总额
    userBetCount: number; // 用户投币人数
};

// 开奖投注小票类型
type DrawReceiptType = {
    orderNo: string;
    gameWagerId: number;
    winAmount: number; // 赢的金额
    winLostStatus: "Create" | "Lose" | "Win" | "Tie"; //输赢状态：创建 Create,输 Lose，赢 Win, 和 Tie
    drawOdds: number; // 开奖赔率
  };

type UserBetReqType = {
    gameRoomId: string;
    gameRoundId: string;
    betAmount: number;
    currency: string;
    bets: { gameWagerId: number; chip: number }[];
    limitRule: { currency: string; minAmount: number; maxAmount: number };
    device: DeviceInfo;
    extra: Object;
};

type UserBetCancelReqType = {
    gameRoomId: string;
    gameRoundId: string;
    orderNoList: string[];
    device: DeviceInfo;
};

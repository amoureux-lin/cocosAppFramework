declare namespace SocketType {
  type BetCommandData = {
    amount: number;
    userId: string;
    gameWagerId: number;
    gameRoundId: string;
  };

  type BetCommand = {
    command: string;
    data: object;
  };
}

type SocketCommandData<T> = {
  command: string;
  data: T;
};

type SocketReceiptType = {
  receipts: DrawReceiptType[];
  gameRoundId: string;
};

type SocketDrawType = {
  payload: DrawResultType;
};

type SocketWonRankType = {
  wonRankingList: WonRankType[];
};

type SocketBetStartType = {
  header?: { roundNo?: string };
};

type SocketBetData = {
  amount: number;
  userId: string;
  gameWagerId: number;
  gameRoundId: string;
};

type SocketDataType = {
  id: string;
  command: number;
  time: number;
  data:
    | BalanceType
    | SocketDrawType
    | SocketReceiptType
    | SocketWonRankType
    | SocketBetStartType
    | SocketBetData[]
    | GameInfo.CommandType[]
    | DynamicOddsType[]
    | BetRateType[]
  gameRoundId: string;
  gameRoundNo: string;
  isCommand?: boolean;
  gameRoomId?: string;
};

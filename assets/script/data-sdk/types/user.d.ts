type BalanceType = {
  balance: number;
  currency: string;
  transStauts: "Pending" | "Settled"; // 账变状态, Pending待处理，Settled已结算
};

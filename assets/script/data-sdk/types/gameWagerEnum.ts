// 急速百家乐玩法Id
export enum SpeedBaccaratGameWagerType {
    Banker = 1, // 庄
    Player = 2, // 闲
    Tie = 3, // 和
    P_Bouns = 9, // 闲龙宝
    P_Pair = 5, // 闲对
    PerfectPair = 11, // 完美对子
    B_Bonus = 8, // 庄龙宝
    B_Pair = 4, // 庄对子
    Either_Pair = 10, // 任意对子
  }
  
  // 经典百家乐玩法Id
  export enum ClassicBaccaratGameWagerType {
    Banker = 17, // 庄
    Player = 18, // 闲
    Tie = 19, // 和
    P_Bouns = 24, // 闲龙宝
    P_Pair = 21, // 闲对
    PerfectPair = 26, // 完美对子
    B_Bonus = 23, // 庄龙宝
    B_Pair = 20, // 庄对子
    Either_Pair = 25, // 任意对子
  }
  
  // 龙虎玩法Id枚举
  export enum DragonTigerGameWagerType {
    Dragon = 32, // 龙
    Tiger = 33, // 虎
    Tie = 34, // 和
    Suited_Tie = 50, // 同花顺和
  }
  
  // 骰宝游戏玩法类型枚举
  export enum DiceGameWagerType {
    Big = 101, // 大
    Small = 102, // 小
    Odd = 103, // 奇
    Even = 104, // 偶
    Total_4 = 105, // 总值-4
    Total_5 = 106, // 总值-5
    Total_6 = 107, // 总值-6
    Total_7 = 108, // 总值-7
    Total_8 = 109, // 总值-8
    Total_9 = 110, // 总值-9
    Total_10 = 111, // 总值-10
    Total_11 = 112, // 总值-11
    Total_12 = 113, // 总值-12
    Total_13 = 114, // 总值-13
    Total_14 = 115, // 总值-14
    Total_15 = 116, // 总值-15
    Total_16 = 117, // 总值-16
    Total_17 = 118, // 总值-17
    Single_1 = 119, // 单-1
    Single_2 = 120, // 单-2
    Single_3 = 121, // 单-3
    Single_4 = 122, // 单-4
    Single_5 = 123, // 单-5
    Single_6 = 124, // 单-6
    Pair_1 = 125, // 双-1
    Pair_2 = 126, // 双-2
    Pair_3 = 127, // 双-3
    Pair_4 = 128, // 双-4
    Pair_5 = 129, // 双-5
    Pair_6 = 130, // 双-6
    Triple_1 = 131, // Triple-1
    Triple_2 = 132, // Triple-2
    Triple_3 = 133, // Triple-3
    Triple_4 = 134, // Triple-4
    Triple_5 = 135, // Triple-5
    Triple_6 = 136, // Triple-6
    Triple = 137, // 任意三
    Combo_1_2 = 138, // 组合1-2
    Combo_1_3 = 139, // 组合1-3
    Combo_1_4 = 140, // 组合1-4
    Combo_1_5 = 141, // 组合1-5
    Combo_1_6 = 142, // 组合1-6
    Combo_2_3 = 143, // 组合2-3
    Combo_2_4 = 144, // 组合2-4
    Combo_2_5 = 145, // 组合2-5
    Combo_2_6 = 146, // 组合2-6
    Combo_3_4 = 147, // 组合3-4
    Combo_3_5 = 148, // 组合3-5
    Combo_3_6 = 149, // 组合3-6
    Combo_4_5 = 150, // 组合4-5
    Combo_4_6 = 151, // 组合4-6
    Combo_5_6 = 152, // 组合5-6
  }

  // 轮盘游戏玩法类型枚举
export enum RouletteGameWagerType {
  // 直注
  StraightBet_0 = 153,
  StraightBet_1 = 154,
  StraightBet_2 = 155,
  StraightBet_3 = 156,
  StraightBet_4 = 157,
  StraightBet_5 = 158,
  StraightBet_6 = 159,
  StraightBet_7 = 160,
  StraightBet_8 = 161,
  StraightBet_9 = 162,
  StraightBet_10 = 163,
  StraightBet_11 = 164,
  StraightBet_12 = 165,
  StraightBet_13 = 166,
  StraightBet_14 = 167,
  StraightBet_15 = 168,
  StraightBet_16 = 169,
  StraightBet_17 = 170,
  StraightBet_18 = 171,
  StraightBet_19 = 172,
  StraightBet_20 = 173,
  StraightBet_21 = 174,
  StraightBet_22 = 175,
  StraightBet_23 = 176,
  StraightBet_24 = 177,
  StraightBet_25 = 178,
  StraightBet_26 = 179,
  StraightBet_27 = 180,
  StraightBet_28 = 181,
  StraightBet_29 = 182,
  StraightBet_30 = 183,
  StraightBet_31 = 184,
  StraightBet_32 = 185,
  StraightBet_33 = 186,
  StraightBet_34 = 187,
  StraightBet_35 = 188,
  StraightBet_36 = 189,
  // 角注
  CornerBet_1_2_4_5 = 264,
  CornerBet_2_3_5_6 = 265,
  CornerBet_4_5_7_8 = 266,
  CornerBet_5_6_8_9 = 267,
  CornerBet_7_8_10_11 = 268,
  CornerBet_8_9_11_12 = 269,
  CornerBet_10_11_13_14 = 270,
  CornerBet_11_12_14_15 = 271,
  CornerBet_13_14_16_17 = 272,
  CornerBet_14_15_17_18 = 273,
  CornerBet_16_17_19_20 = 274,
  CornerBet_17_18_20_21 = 275,
  CornerBet_19_20_22_23 = 276,
  CornerBet_20_21_23_24 = 277,
  CornerBet_22_23_25_26 = 278,
  CornerBet_23_24_26_27 = 279,
  CornerBet_25_26_28_29 = 280,
  CornerBet_26_27_29_30 = 281,
  CornerBet_28_29_31_32 = 282,
  CornerBet_29_30_32_33 = 283,
  CornerBet_31_32_34_35 = 284,
  CornerBet_32_33_35_36 = 285,

  Dozens_Bet_1st_12 = 300,
  Dozens_Bet_2nd_12 = 301,
  Dozens_Bet_3rd_12 = 302,
  Odd = 305,
  Even = 306,
  Black = 304,
  Red = 303,
  Num_1_18 = 307,
  Num_19_36 = 308,
  // 列注
  Top_2to1 = 297,
  Middle_2to1 = 298,
  Bottom_2to1 = 299,

  // 行拆 (Row Splits)
  SplitBet_Row_0_1 = 190,
  SplitBet_Row_0_2 = 191,
  SplitBet_Row_0_3 = 192,
  SplitBet_Row_1_4 = 194,
  SplitBet_Row_2_5 = 196,
  SplitBet_Row_3_6 = 197,
  SplitBet_Row_4_7 = 199,
  SplitBet_Row_5_8 = 201,
  SplitBet_Row_6_9 = 202,
  SplitBet_Row_7_10 = 204,
  SplitBet_Row_8_11 = 206,
  SplitBet_Row_9_12 = 207,
  SplitBet_Row_10_13 = 209,
  SplitBet_Row_11_14 = 211,
  SplitBet_Row_12_15 = 212,
  SplitBet_Row_13_16 = 214,
  SplitBet_Row_14_17 = 216,
  SplitBet_Row_15_18 = 217,
  SplitBet_Row_16_19 = 219,
  SplitBet_Row_17_20 = 221,
  SplitBet_Row_18_21 = 222,
  SplitBet_Row_19_22 = 224,
  SplitBet_Row_20_23 = 226,
  SplitBet_Row_21_24 = 227,
  SplitBet_Row_22_25 = 229,
  SplitBet_Row_23_26 = 231,
  SplitBet_Row_24_27 = 232,
  SplitBet_Row_25_28 = 234,
  SplitBet_Row_26_29 = 236,
  SplitBet_Row_27_30 = 237,
  SplitBet_Row_28_31 = 239,
  SplitBet_Row_29_32 = 241,
  SplitBet_Row_30_33 = 242,
  SplitBet_Row_31_34 = 244,
  SplitBet_Row_32_35 = 246,
  SplitBet_Row_33_36 = 247,
  // 列拆 (Col Splits)
  SplitBet_Col_1_2 = 193,
  SplitBet_Col_2_3 = 195,
  SplitBet_Col_4_5 = 198,
  SplitBet_Col_5_6 = 200,
  SplitBet_Col_7_8 = 203,
  SplitBet_Col_8_9 = 205,
  SplitBet_Col_10_11 = 208,
  SplitBet_Col_11_12 = 210,
  SplitBet_Col_13_14 = 213,
  SplitBet_Col_14_15 = 215,
  SplitBet_Col_16_17 = 218,
  SplitBet_Col_17_18 = 220,
  SplitBet_Col_19_20 = 223,
  SplitBet_Col_20_21 = 225,
  SplitBet_Col_22_23 = 228,
  SplitBet_Col_23_24 = 230,
  SplitBet_Col_25_26 = 233,
  SplitBet_Col_26_27 = 235,
  SplitBet_Col_28_29 = 238,
  SplitBet_Col_29_30 = 240,
  SplitBet_Col_31_32 = 243,
  SplitBet_Col_32_33 = 245,
  SplitBet_Col_34_35 = 248,
  SplitBet_Col_35_36 = 249,

  // 路注
  StreetBet_1_2_3 = 250,
  StreetBet_4_5_6 = 251,
  StreetBet_7_8_9 = 252,
  StreetBet_10_11_12 = 253,
  StreetBet_13_14_15 = 254,
  StreetBet_16_17_18 = 255,
  StreetBet_19_20_21 = 256,
  StreetBet_22_23_24 = 257,
  StreetBet_25_26_27 = 258,
  StreetBet_28_29_30 = 259,
  StreetBet_31_32_33 = 260,
  StreetBet_34_35_36 = 261,
  StreetBet_0_1_2 = 262,
  StreetBet_0_2_3 = 263,
  // 线注
  LineBet_1_2_3_4_5_6 = 286,
  LineBet_4_5_6_7_8_9 = 287,
  LineBet_7_8_9_10_11_12 = 288,
  LineBet_10_11_12_13_14_15 = 289,
  LineBet_13_14_15_16_17_18 = 290,
  LineBet_16_17_18_19_20_21 = 291,
  LineBet_19_20_21_22_23_24 = 292,
  LineBet_22_23_24_25_26_27 = 293,
  LineBet_25_26_27_28_29_30 = 294,
  LineBet_28_29_30_31_32_33 = 295,
  LineBet_31_32_33_34_35_36 = 296,
}

  
type RoadItem = {
    location: [number, number];
    mode: number;
    type: number;
    isFlash?: boolean;
    hasTie?: boolean;
  };
  
  type Item = {
    // 定位
    location: Array<number>;
    // 问路闪烁控制
    isFlash?: boolean;
    // 庄闲和判断
    type: number;
    // 庄闲：1、龙宝：2、点数：3、上路：4、下1路：5，下2路：6，下3路：7
    mode: number;
  };
  
  type ArrayItem = Array<Item>;
  
  type BottomArrayItem = {
    [key: string]: ArrayItem;
  };
  
  // 珠code类型
  type BeadCodeType = {
    banker: number;
    player: number;
    tie: number;
    b_pair?: number;
    p_pair?: number;
  };

  // 珠code类型
  type DtBeadCodeType = {
    dragon: number;
    tiger: number;
    tie: number;
  };
  
  // 珠类型定义
  type RoadBeadItem = {
    location: [number, number];
    // 投币区结果数据
    result: number[];
  };
  
  type BeadInjectInfo = {
    bankerColor?: string;
    playerColor?: string;
    bankerInitials?: string; // banker首字母
    playerInitials?: string; // player首字母
  };
  
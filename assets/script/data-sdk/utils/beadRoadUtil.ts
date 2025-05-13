
/**
 * 根据result生成路图(抽象大路和下三路的逻辑)
 * @param resultList
 * @param beadCode
 */
function buildRoadByResult(resultList: number[][], beadCode: BeadCodeType) {
    if (resultList.length == 0) {
        return [];
    }
    const girdRow = 6;
    let itemList: RoadBeadItem[] = [{ location: [1, 1], result: resultList[0] }];
    let curRow = 1,
        curCol = 1;
    let overflowNum = 0; // 当到达路子的末尾的时候，溢出的元素数量
    for (const result of resultList.slice(1)) {
        const lastRoadItem = itemList[itemList.length - 1];
        if (
        (lastRoadItem.result.indexOf(beadCode.banker)>=0 &&
            result.indexOf(beadCode.banker)>=0) ||
        (lastRoadItem.result.indexOf(beadCode.player)>=0 &&
            result.indexOf(beadCode.player)>=0)
        ) {
            const hasFilled = itemList.find(
                (item) => item.location[0] == curCol && item.location[1] == curRow + 1
            );

            if (curRow == girdRow || hasFilled) {
                overflowNum += 1;
            } else {
                curRow += 1;
                overflowNum = 0;
            }
        } else {
            curCol += 1;
            curRow = 1;
            overflowNum = 0;
        }
        itemList.push({ location: [curCol + overflowNum, curRow], result });
    }
    return itemList;
}

/**
 * 生成大路数据
 * @param resultList
 * @param beadCode
 * @param maxCol
 */
export function buildBigRoad(
resultList: number[][],
beadCode: BeadCodeType
): RoadBeadItem[] {
    const bigRoadResultList: number[][] = [];
    // 合并Tie到他的上一个元素，生成新的resultList
    for (const result of resultList) {
        const lastResult = bigRoadResultList.length > 0 ? bigRoadResultList[bigRoadResultList.length - 1] : null;
        if (result && result.indexOf(beadCode.tie)>=0 && lastResult) {
            bigRoadResultList[bigRoadResultList.length - 1] = [
                ...result,
                ...lastResult,
            ];
        } else {
            bigRoadResultList.push(result);
        }
    }
    return buildRoadByResult(bigRoadResultList, beadCode);
}

/**
 * 生成珠盘路数据逻辑
 * @param resultList
 * @returns
 */
export function buildBeadPlate(resultList: number[][]) {
    const maxRow = 6;
    let curRow = 1;
    let curCol = 1;
    const itemList: RoadBeadItem[] = [];
    for (const result of resultList) {
        itemList.push({ location: [curCol, curRow], result });
        if (curRow > maxRow) {
            curRow = 1;
            curCol += 1;
        } else {
            curRow += 1;
        }
    }
    return itemList;
}

/**
 * 生成珠盘路数据逻辑
 * @param resultList
 * @returns
 */
export function askBeadPlateRoad(
roadItemList: RoadBeadItem[],
beadCodeType: number
): RoadBeadItem[] {
    const maxRow = 6;
    if (roadItemList.length == 0) {
        return [{ location: [1, 1], result: [beadCodeType] }];
    }

    const lastItem = roadItemList[roadItemList.length - 1];
    let location: [number, number];
    if (lastItem.location[1] == maxRow) {
        location = [lastItem.location[0] + 1, 1];
    } else {
        location = [lastItem.location[0], lastItem.location[1] + 1];
    }
    return [...roadItemList, { location, result: [beadCodeType] }];
}

/**
 *
 * 根据大路生成下三路的算法
 * @param bigRoadItemList 大路列表
 * @param beadCode 路珠Code类型
 * @param startCol 开始列数
 * @param startRow 开始行数
 * @param gap 间距
 * @returns
 */
export function buildBottomRoadByBigRoadData(
bigRoadItemList: RoadBeadItem[],
beadCode: BeadCodeType,
startCol: number,
startRow: number,
gap: number
) {
    const hasStartItem = bigRoadItemList.find(
        (item) => item.location[0] == startCol && item.location[1] == startRow
    );
    if (!hasStartItem) {
        startCol += 1;
        startRow = 1;
    }
    const filteredBigRoadItemList = bigRoadItemList.filter(
        (item) => item.location[0] >= startCol && item.location[1] >= startRow
    );

    const resultList: number[][] = [];

    for (const roadItem of filteredBigRoadItemList) {
        let curBeadCode = beadCode.banker;
        // 如果是大路第一行元素, 比较该元素前两gap列填充的元素长度是否相等
        if (roadItem.location[1] == 1) {
            const lastColItems = bigRoadItemList.filter(
                (item) => item.location[0] == roadItem.location[0] - 1
            );
            const lastGapColItems = bigRoadItemList.filter(
                (item) => item.location[0] == roadItem.location[0] - 1 - gap
            );
            if (lastColItems.length != lastGapColItems.length) {
                curBeadCode = beadCode.player;
            }
        }
        // 如果不是大路第一行元素, 判断该元素的上gap列的填充个数，如果正好是该元素的行数-1，就为player
        else {
            const lastColItems = bigRoadItemList.filter(
                (item) => item.location[0] == roadItem.location[0] - gap
            );
            if (lastColItems.length == roadItem.location[1] - 1) {
                curBeadCode = beadCode.player;
            }
        }

        resultList.push([curBeadCode]);
    }
    return buildRoadByResult(resultList, beadCode);
}

/**
 *
 * 问路逻辑
 * @param bigRoadItemList
 * @param beadCodeType
 * @returns
 */
export function askRoad(
    bigRoadItemList: RoadBeadItem[],
    beadCodeType: number
    ): RoadBeadItem[] {
    const maxRow = 6;
    if (bigRoadItemList.length == 0) {
        return [{ location: [1, 1], result: [beadCodeType] }];
    }

    const lastItem = bigRoadItemList[bigRoadItemList.length - 1];
    let location: [number, number];
    if (lastItem.result.indexOf(beadCodeType)>=0) {
        // 下一个元素是否被填充了
        const hasNextFilled = bigRoadItemList.find(
        (item) =>
            item.location[0] == lastItem.location[0] &&
            item.location[1] == lastItem.location[1] + 1
        );
        if (hasNextFilled || lastItem.location[1] == maxRow) {
            location = [lastItem.location[0] + 1, lastItem.location[1]];
        } else {
            location = [lastItem.location[0], lastItem.location[1] + 1];
        }
    } else {
        location = [lastItem.location[0] + 1, 1];
    }
    return [...bigRoadItemList, { location, result: [beadCodeType] }];
}

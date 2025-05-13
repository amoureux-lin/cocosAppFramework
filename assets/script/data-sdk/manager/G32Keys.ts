/**
 * 协议扩展 通过： export const  MSG_XXX:string = ++index;
 */

export class INDEX {
    private static _index = 0x10000001;

    static index(fix:string = "") : string{
        return ++INDEX._index + "_" + fix;
    }
}

/**Game消息 */
export namespace G32Keys {
	/** API回调：Join回包 */
	export const MSG_G32_GAME_JOIN: string = INDEX.index();
	/** API回调：当前局历史投注数据 回包 */
	export const MSG_G32_GAME_BET_RECORDS_CUR_ROUND: string = INDEX.index();
	/** Ws通知：开始bet */
	export const MSG_G32_GAME_START: string = INDEX.index();
	/** API回调：投币回包*/
	export const MSG_G32_GAME_BET: string = INDEX.index();
	/** API回调：投币取消*/
	export const MSG_G32_GAME_BET_CANCEL: string = INDEX.index();
	/** API回调：投币确认回包*/
	export const MSG_G32_GAME_BET_CONFIRMED: string = INDEX.index();
	/** Ws通知：停止bet */
	export const MSG_G32_GAME_STOP: string = INDEX.index();
	/** Ws通知：发牌*/
	export const MSG_G32_GAME_DATA: string = INDEX.index();
	/** Ws通知：恢复牌值*/
	export const MSG_G32_GAME_REVERT_POKERS: string = INDEX.index();
	/** Ws通知：游戏结果*/
	export const MSG_G32_GAME_RESULT: string = INDEX.index();
	/** Ws通知：游戏派彩*/
	export const MSG_G32_GAME_PAYOUT: string = INDEX.index();
	/** Ws通知：在线人数*/
	export const MSG_G32_ONLINE_USER: string = INDEX.index();
	/** Ws通知：换靴*/
	export const MSG_G32_GAME_NEW_SHOE: string = INDEX.index();
	/** API回调：获取露珠数据*/
	export const MSG_G32_GAME_BEAD: string = INDEX.index();
	/** Ws通知：奖池更新*/
	export const MSG_G32_GAME_POOL: string = INDEX.index();
	/** API回调：额度更新*/
	export const MSG_G32_GAME_BALANCE: string = INDEX.index();
	/** API回调：投币记录 */
	export const MSG_G32_HISTORY_LIST: string = INDEX.index();
	/** API回调：缓存指令记录 */
	export const MSG_G32_COMMAND_HISTORY: string = INDEX.index();
	/** API回调：限红列表 */
	export const MSG_G32_LIMIT_LIST: string = INDEX.index();
	/** WS回调：中奖排名 */
	export const MSG_G32_WON_RANK: string = INDEX.index();
	/** WS回调：维护通知 */
	export const MSG_G32_MAINTAIN: string = INDEX.index();
	/** WS回调：游戏关闭 */
	export const MSG_G32_GAME_CLOSE: string = INDEX.index();
	///////////////////////////////////////////////////////////


}
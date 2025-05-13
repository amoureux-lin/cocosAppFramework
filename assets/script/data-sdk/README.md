# G32-Game-sdk

G32 SDK接入库

ChangeLog:
v1.0.0
初始版本

# 2025-02-21
v1.0.1
1. API 新增cancelLastBet取消最后一注接口
2. API 优化doBet，新增extra属性
3. 其它优化


# 2025-03-7
v1.0.2
1. http header 新增 Game-Room-Id 和 Limit-Rule-Group-Id
2. ws Join 增加 limitRuleGroupId

# 2025-03-11
v1.0.3
1. reqBetHistoryList 接口新增 betBeginTime 和 betEndTime 参数;
2. 新增获取getCommandHistory缓存指令接口与逻辑
3. 新增onlineNumber ws消息，G32Keys.MSG_G32_ONLINE_USER

# 2025-04-07
v1.0.4
1. 新增游戏维护消息MSG_G32_MAINTAIN

# 2025-04-23
v1.0.5
1. 新增额外自定义协议处理器，详见initProcesser方法

# 2025-04-29
v1.0.6
1. 同步bet_start时，gameRoundNo赋值
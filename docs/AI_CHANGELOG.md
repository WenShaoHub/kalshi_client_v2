# AI Changelog

记录由 AI 完成的代码逻辑变更（功能、Bug 修复、重构），便于追溯与回归分析。

---

## [2025-02-05 12:00] [Feature]
- **Change**: 市场详情页 2.3 接真实 API（getMarket + getEvent），适配器对齐事件头、Chance 列表、human 概率 (yes_ask+yes_bid)/2、AI 文本 anchors+blindspots、免责声明与 Yes/No 价格
- **Risk Analysis**: 无 event_ticker 时仅单 market 展示；getEvent 失败时降级为仅 market 适配；空 markets 数组时仍可展示；列表页与详情页共用 human 概率与 AI 文本规则，需保持一致性。
----------------------------------------

## [2025-02-05] [Feature]
- **Change**: 功能 2.4 Live（日历）：新增 /calendar 路由与 Calendar 页，getEvents(min_close_ts, status=open, with_nested_markets) 获取即将到期事件，按 close_time 排序后 adaptEventsToCards + MarketCard 展示；Header 改为 Link 并支持 Live 高亮；技术文档 04_calendar_implementation.md。
- **Risk Analysis**: 依赖后端 events 接口返回 open 状态及 min_close_ts 筛选；无数据或接口失败时展示空态/错误与返回首页链接。
----------------------------------------

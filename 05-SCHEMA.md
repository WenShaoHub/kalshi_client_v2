# 表结构设计（Supabase）

后端将 Kalshi 的 Series、Event、Market 数据结构化存储到 Supabase（PostgreSQL），用于查询、筛选与缓存。SQL 定义见 `backend/schema.sql`，可在 Supabase Dashboard → SQL Editor 中直接执行该文件完成建表。

## 一、层级关系

```
Series（系列）  →  Event（事件）  →  Market（市场）
     ticker           event_ticker        ticker
        ↑                    ↑                ↑
   series_ticker        event_ticker      (PK)
```

- **kalshi_series**：顶层，按主题/分类（如 Politics、Sports）组织。
- **kalshi_events**：属于某系列，`series_ticker` → `kalshi_series.ticker`。
- **kalshi_markets**：属于某事件，`event_ticker` → `kalshi_events.event_ticker`。

## 二、表清单

| 表名 | 说明 | 主键 |
|------|------|------|
| api_cache | API 响应短期缓存（markets 等） | cache_key |
| kalshi_series | 系列（对应 Kalshi GET /series） | ticker |
| kalshi_events | 事件（对应 Kalshi GET /events） | event_ticker |
| kalshi_markets | 市场（对应 Kalshi GET /markets） | ticker |
| kalshi_events_review | 事件 AI 审计结果（仅新增字段） | event_ticker |
| kalshi_markets_review | 市场 AI 审计结果（仅新增字段） | ticker |
| kalshi_sync_log | 同步任务日志（可选） | id |

## 三、字段说明

### 3.1 api_cache

| 字段 | 类型 | 说明 |
|------|------|------|
| cache_key | TEXT (PK) | 缓存键，如 `markets:100::open:trending` |
| value | TEXT | JSON 序列化后的响应体 |
| expires_at | DOUBLE PRECISION | 过期时间戳 |
| updated_at | DOUBLE PRECISION | 最后更新时间 |

### 3.2 kalshi_series

对应 [Kalshi Get Series](https://docs.kalshi.com/api-reference/market/get-series) / [Get Series List](https://docs.kalshi.com/api-reference/market/get-series-list)。

| 字段 | 类型 | 说明 | Kalshi 字段 |
|------|------|------|-------------|
| ticker | TEXT (PK) | 系列唯一标识 | ticker |
| frequency | TEXT | 频率 | frequency |
| title | TEXT | 标题 | title |
| category | TEXT | 分类（Politics/Sports/…） | category |
| tags | TEXT[] | 标签数组 | tags |
| settlement_sources | JSONB | [{name, url}, …] | settlement_sources |
| contract_url | TEXT | 合约链接 | contract_url |
| contract_terms_url | TEXT | 条款链接 | contract_terms_url |
| fee_type | TEXT | 费用类型 | fee_type |
| fee_multiplier | NUMERIC | 费用乘数 | fee_multiplier |
| additional_prohibitions | TEXT[] | 额外禁止项 | additional_prohibitions |
| product_metadata | JSONB | 产品元数据 | product_metadata |
| volume | BIGINT | 总成交量 | volume |
| volume_fp | TEXT | 成交量高精度 | volume_fp |
| raw | JSONB | 原始 API 完整 JSON | — |
| synced_at | TIMESTAMPTZ | 同步时间 | — |

**索引**：category, synced_at

### 3.3 kalshi_events

对应 [Kalshi Get Event](https://docs.kalshi.com/api-reference/events/get-event) / [Get Events](https://docs.kalshi.com/api-reference/events/get-events)。

| 字段 | 类型 | 说明 | Kalshi 字段 |
|------|------|------|-------------|
| event_ticker | TEXT (PK) | 事件唯一标识 | event_ticker |
| series_ticker | TEXT (FK→kalshi_series) | 所属系列 | series_ticker |
| title | TEXT | 标题 | title |
| sub_title | TEXT | 副标题 | sub_title |
| category | TEXT | 分类 | category |
| collateral_return_type | TEXT | 抵押返还类型 | collateral_return_type |
| mutually_exclusive | BOOLEAN | 是否互斥 | mutually_exclusive |
| available_on_brokers | BOOLEAN | 经纪商可用 | available_on_brokers |
| product_metadata | JSONB | 产品元数据 | product_metadata |
| strike_date | TIMESTAMPTZ | 结算/strike 日期 | strike_date |
| strike_period | TEXT | strike 周期 | strike_period |
| raw | JSONB | 原始 API 完整 JSON | — |
| synced_at | TIMESTAMPTZ | 同步时间 | — |

**索引**：series_ticker, category, strike_date, synced_at

### 3.4 kalshi_markets

对应 [Kalshi Get Market](https://docs.kalshi.com/api-reference/market/get-market) / [Get Markets](https://docs.kalshi.com/api-reference/market/get-markets)。仅列主要字段，完整字段见 `backend/schema.sql`。

| 字段 | 类型 | 说明 | Kalshi 字段 |
|------|------|------|-------------|
| ticker | TEXT (PK) | 市场唯一标识 | ticker |
| event_ticker | TEXT (FK→kalshi_events) | 所属事件 | event_ticker |
| market_type | TEXT | 如 binary | market_type |
| title | TEXT | 标题 | title |
| subtitle | TEXT | 副标题 | subtitle |
| yes_sub_title, no_sub_title | TEXT | Yes/No 副标题 | yes_sub_title, no_sub_title |
| created_time, updated_time | TIMESTAMPTZ | 创建/更新时间 | created_time, updated_time |
| open_time, close_time | TIMESTAMPTZ | 开放/关闭时间 | open_time, close_time |
| expiration_time, expected_expiration_time | TIMESTAMPTZ | 到期时间 | expiration_time, expected_expiration_time |
| status | TEXT | initialized/open/closed/… | status |
| yes_bid, yes_ask, no_bid, no_ask | INT | 买卖价（分） | yes_bid, yes_ask, no_bid, no_ask |
| yes_bid_dollars, yes_ask_dollars, … | TEXT | 买卖价（元） | 同上 _dollars |
| last_price, last_price_dollars | INT, TEXT | 最新价 | last_price, last_price_dollars |
| volume, volume_fp | BIGINT, TEXT | 总成交量 | volume, volume_fp |
| volume_24h, volume_24h_fp | BIGINT, TEXT | 24h 成交量 | volume_24h, volume_24h_fp |
| result | TEXT | yes/no/null | result |
| can_close_early | BOOLEAN | 是否可提前平仓 | can_close_early |
| open_interest, open_interest_fp | BIGINT, TEXT | 未平仓 | open_interest, open_interest_fp |
| notional_value, liquidity | BIGINT | 名义价值、流动性 | notional_value, liquidity |
| tick_size | INT | 最小报价单位 | tick_size |
| rules_primary, rules_secondary | TEXT | 规则说明 | rules_primary, rules_secondary |
| price_ranges | JSONB | [{start,end,step}, …] | price_ranges |
| settlement_value, settlement_ts | INT, TIMESTAMPTZ | 结算值、结算时间 | settlement_value, settlement_ts |
| strike_type, floor_strike, cap_strike | TEXT, NUMERIC | Strike 相关 | strike_type, floor_strike, cap_strike |
| custom_strike | JSONB | 自定义 strike | custom_strike |
| mve_collection_ticker, mve_selected_legs | TEXT, JSONB | MVE 相关 | mve_collection_ticker, mve_selected_legs |
| primary_participant_key, is_provisional | TEXT, BOOLEAN | 参与方、是否临时 | primary_participant_key, is_provisional |
| raw | JSONB | 原始 API 完整 JSON | — |
| synced_at | TIMESTAMPTZ | 同步时间 | — |

**索引**：event_ticker, status, close_time, created_time, synced_at

### 3.5 kalshi_events_review

对应 `/api/v1/review/ai-event` 审计后的事件级新增字段，主键与 `kalshi_events` 一致，便于 JOIN。不存储原表已有字段。

| 字段 | 类型 | 说明 |
|------|------|------|
| event_ticker | TEXT (PK, FK→kalshi_events) | 事件唯一标识，与 kalshi_events 主键一致 |
| blindspots | TEXT | AI 输出的盲区/情绪偏见或信息缺失描述 |
| anchors | TEXT | AI 输出的客观锚点事实（法律、历史、硬数据） |
| reviewed_at | TIMESTAMPTZ | 审计时间，默认 NOW() |

**索引**：reviewed_at

### 3.6 kalshi_markets_review

对应 `/api/v1/review/ai-event` 审计后的市场级新增字段，主键与 `kalshi_markets` 一致，便于 JOIN。不存储原表已有字段。

| 字段 | 类型 | 说明 |
|------|------|------|
| ticker | TEXT (PK, FK→kalshi_markets) | 市场唯一标识，与 kalshi_markets 主键一致 |
| yes_calibration | INT | 修正后的 Yes 结果概率（0–100 分），可 NULL |
| no_calibration | INT | 修正后的 No 结果概率（0–100 分），可 NULL |
| reviewed_at | TIMESTAMPTZ | 审计时间，默认 NOW() |

**约束**：yes_calibration、no_calibration 均受 CHECK 限制在 0–100（含 NULL）。  
**索引**：reviewed_at

### 3.7 kalshi_sync_log

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGSERIAL (PK) | 自增主键 |
| sync_type | TEXT | 如 full |
| started_at, finished_at | DOUBLE PRECISION | 开始/结束时间戳 |
| status | TEXT | running / completed / partial_failure |
| events_count, markets_count, series_count | INTEGER | 各表同步条数 |

## 四、使用方式

1. **建表**：在 Supabase 项目中打开 **SQL Editor**，将 `backend/schema.sql` 内容粘贴执行（或上传文件执行）。  
   - 执行会 **DROP 并重建** `kalshi_series`、`kalshi_events`、`kalshi_markets`，若有重要数据请先备份。
2. **配置**：在应用环境变量中配置 `SUPABASE_URL`、`SUPABASE_KEY`。
3. **数据写入**：通过自建同步脚本或定时任务，从 Kalshi API 拉取 GET /series、GET /events、GET /markets 数据，解析后写入上述三张表（并可选写入 `raw` 与 `kalshi_sync_log`）。

## 五、查询示例

- 按系列查事件：`SELECT * FROM kalshi_events WHERE series_ticker = 'KXBTC' ORDER BY strike_date DESC;`
- 按事件查市场：`SELECT * FROM kalshi_markets WHERE event_ticker = 'KXBTC-24' AND status = 'open';`
- 按分类查系列：`SELECT * FROM kalshi_series WHERE category = 'Politics';`
- 按关闭时间查开放市场：`SELECT * FROM kalshi_markets WHERE status = 'open' AND close_time > NOW() ORDER BY volume_24h DESC NULLS LAST;`
- 某事件的审计结果（事件 + 其下市场审计）：`SELECT e.*, er.blindspots, er.anchors, er.reviewed_at FROM kalshi_events e LEFT JOIN kalshi_events_review er ON e.event_ticker = er.event_ticker WHERE e.event_ticker = 'KXBTC-24';` 市场级审计通过 `kalshi_markets_review` 与 `kalshi_markets` 的 ticker JOIN 即可。

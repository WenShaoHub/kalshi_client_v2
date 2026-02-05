# API 接口设计文档

## 一、基础信息

- **Base URL**：`https://kalshi-markets-production.up.railway.app`（生产）或 `http://localhost:5000`（开发）
- **数据格式**：JSON
- **字符编码**：UTF-8
- **响应格式**：  
  - 成功：`{ "success": true, "data": {...} }`，`data` 透传 Kalshi 原始响应或约定结构，不遗漏关键字段  
  - 失败：`{ "success": false, "error": { "code": "...", "message": "..." } }`

## 二、接口列表（按模块）

### 健康检查

| 接口 | 说明 |
|------|------|
| GET / | 健康检查，返回 `{ "ok": true, "service": "kalshi-markets-api" }` |

### Exchange 交易所

| 接口 | 说明 | Kalshi 文档 |
|------|------|-------------|
| GET /api/v1/exchange/status | 交易所状态 | [Get Exchange Status](https://docs.kalshi.com/api-reference/exchange/get-exchange-status) |
| GET /api/v1/exchange/announcements | 交易所公告 | [Get Exchange Announcements](https://docs.kalshi.com/api-reference/exchange/get-exchange-announcements) |
| GET /api/v1/exchange/schedule | 交易时段 | [Get Exchange Schedule](https://docs.kalshi.com/api-reference/exchange/get-exchange-schedule) |

### Events 事件

| 接口 | 说明 |
|------|------|
| GET /api/v1/events | 事件列表（支持 limit, cursor, with_nested_markets, with_milestones, status, series_ticker, min_close_ts） |
| GET /api/v1/events/{event_ticker} | 单个事件详情 |
| GET /api/v1/events/{event_ticker}/metadata | 事件元数据 |

### Categories 分类

| 接口 | 说明 |
|------|------|
| GET /api/v1/categories | 分类列表（自定义 id/label；按分类筛市场需先调 series?category=xxx 再调 markets?series_ticker=xxx） |

### Markets 市场

| 接口 | 说明 |
|------|------|
| GET /api/v1/markets | Markets 列表（透传 [Kalshi GET /markets](https://docs.kalshi.com/api-reference/market/get-markets) 参数） |
| GET /api/v1/markets/{ticker} | 单个 Market 详情 |
| GET /api/v1/markets/{ticker}/orderbook | 订单簿（支持 depth） |
| GET /api/v1/markets/trades | 成交记录（支持 ticker, min_ts, max_ts, limit, cursor） |

### Series 系列

| 接口 | 说明 |
|------|------|
| GET /api/v1/series | 系列列表（支持 category, tags, include_product_metadata, include_volume） |
| GET /api/v1/series/{series_ticker} | 单个系列详情 |

### Milestones 里程碑

| 接口 | 说明 |
|------|------|
| GET /api/v1/milestones | 里程碑列表（支持 limit, cursor） |
| GET /api/v1/milestones/{milestone_id} | 单个里程碑详情 |

### Search 搜索

| 接口 | 说明 |
|------|------|
| GET /api/v1/search/tags_by_categories | 分类与标签映射 |
| GET /api/v1/search/filters_by_sport | 体育筛选选项（透传 Kalshi [GET /search/filters_by_sport](https://docs.kalshi.com/api-reference/search/get-filters-for-sports)） |

### Live Data 实时数据

| 接口 | 说明 |
|------|------|
| GET /api/v1/live-data/{type}/milestone/{milestone_id} | 指定类型与里程碑的实时数据 |

### Incentives 激励

| 接口 | 说明 |
|------|------|
| GET /api/v1/incentives | 激励计划列表（支持 status, type, cursor） |

### Multivariate 多元事件

| 接口 | 说明 |
|------|------|
| GET /api/v1/multivariate-event-collections | 多元事件集合列表（支持 limit, cursor） |
| GET /api/v1/multivariate-event-collections/{ticker} | 单个集合详情 |

### Structured Targets 结构化目标

| 接口 | 说明 |
|------|------|
| GET /api/v1/structured-targets | 结构化目标列表（支持 limit, cursor） |
| GET /api/v1/structured-targets/{target_id} | 单个目标详情 |

### 同步（需配置 Supabase）

| 接口 | 说明 |
|------|------|
| POST /api/v1/sync | 手动触发全量同步（events、markets、series 写入 Supabase），返回本次同步统计 |

---

## 三、核心接口详情

以下按 `routes` 目录下模块顺序列出，所有成功响应均为 `{ "success": true, "data": ... }`，失败为 `{ "success": false, "error": { "code", "message" } }`。

---

### 3.1 Exchange（exchange.py）

#### GET /api/v1/exchange/status

**请求**：无参数。

**响应**：`data` 透传 Kalshi 返回值，含 `exchange_active`, `trading_active`, `exchange_estimated_resume_time` 等。

---

#### GET /api/v1/exchange/announcements

**请求**：无参数。

**响应**：`data` 为交易所公告列表。

---

#### GET /api/v1/exchange/schedule

**请求**：无参数。

**响应**：`data` 为交易时段信息。

---

### 3.2 Events（events.py）

#### GET /api/v1/events

**请求**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | int | 否 | 每页条数，最大 200 |
| cursor | string | 否 | 分页游标 |
| with_nested_markets | bool | 否 | 是否包含嵌套 markets |
| with_milestones | bool | 否 | 是否包含 milestones |
| status | string | 否 | open / closed / settled |
| series_ticker | string | 否 | 按系列筛选 |
| min_close_ts | int | 否 | 最小关闭时间戳（秒） |

**响应**：`data` 含 `events` 数组、`cursor`、可选 `milestones`。

---

#### GET /api/v1/events/{event_ticker}

**请求**：路径参数 `event_ticker`。

**响应**：`data` 为单个事件对象。

---

#### GET /api/v1/events/{event_ticker}/metadata

**请求**：路径参数 `event_ticker`。

**响应**：`data` 为事件元数据。

---

### 3.3 Categories（categories.py）

#### GET /api/v1/categories

**请求**：无参数。

**响应**：`data` 含 `categories` 数组，每项 `{ "id", "label" }`。按分类筛市场需先调 `GET /api/v1/series?category=xxx` 取得 series_ticker，再调 `GET /api/v1/markets?series_ticker=xxx`。

---

### 3.4 Markets（markets.py）

#### GET /api/v1/markets

**请求**：透传 [Kalshi GET /markets](https://docs.kalshi.com/api-reference/market/get-markets) 参数。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | int | 否 | 每页条数，默认 100，最大 1000 |
| cursor | string | 否 | 分页游标 |
| event_ticker | string | 否 | 事件 ticker，逗号分隔最多 10 个 |
| series_ticker | string | 否 | 系列 ticker（分类在 series 接口，此处仅传 series_ticker） |
| status | string | 否 | unopened / open / paused / closed / settled |
| tickers | string | 否 | 市场 ticker 逗号分隔 |
| min_created_ts | int | 否 | 最小创建时间戳 |
| max_created_ts | int | 否 | 最大创建时间戳 |
| min_updated_ts | int | 否 | 最小更新时间戳（与其它筛选互斥） |
| min_close_ts | int | 否 | 最小关闭时间戳 |
| max_close_ts | int | 否 | 最大关闭时间戳 |
| min_settled_ts | int | 否 | 最小结算时间戳 |
| max_settled_ts | int | 否 | 最大结算时间戳 |
| mve_filter | string | 否 | only / exclude（多元事件） |
| sort | string | 否 | 本端二次排序：trending（按 volume_24h）/ new（按 created_time） |

**响应**：`data` 含 `markets` 数组、`cursor`、`has_more`。Market 字段见 Kalshi 文档（含 ticker, event_ticker, yes_sub_title, no_sub_title, last_price_dollars, yes_bid_dollars, yes_ask_dollars, volume_fp, volume_24h_fp, status, close_time 等）。

---

#### GET /api/v1/markets/{ticker}

**请求**：路径参数 `ticker`（市场 ticker）。

**响应**：`data` 为单个市场完整对象。

---

#### GET /api/v1/markets/{ticker}/orderbook

**请求**：路径参数 `ticker`；Query 可选 `depth`（int）。

**响应**：`data` 透传 Kalshi 订单簿。

---

#### GET /api/v1/markets/trades

**请求**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ticker | string | 否 | 市场 ticker |
| min_ts | int | 否 | 最小时间戳 |
| max_ts | int | 否 | 最大时间戳 |
| limit | int | 否 | 条数 |
| cursor | string | 否 | 分页游标 |

**响应**：`data` 含成交记录及分页信息。

---

### 3.5 Series（series.py）

#### GET /api/v1/series

**请求**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | 否 | 分类（series 支持 category，markets 不支持） |
| tags | string | 否 | 标签 |
| include_product_metadata | bool | 否 | 是否含 product_metadata |
| include_volume | bool | 否 | 是否含 volume |

**响应**：`data` 含 `series` 数组。

---

#### GET /api/v1/series/{series_ticker}

**请求**：路径参数 `series_ticker`。

**响应**：`data` 为单个系列对象。

---

### 3.6 Milestones（milestones.py）

#### GET /api/v1/milestones

**请求**：`limit`（int）、`cursor`（string）。

**响应**：`data` 含里程碑列表及分页信息。

---

#### GET /api/v1/milestones/{milestone_id}

**请求**：路径参数 `milestone_id`。

**响应**：`data` 为单个里程碑对象。

---

### 3.7 Search（search.py）

#### GET /api/v1/search/tags_by_categories

**请求**：无参数。

**响应**：`data` 为分类与标签映射（tags_by_categories）。

---

#### GET /api/v1/search/filters_by_sport

**请求**：无参数。

**响应**：`data` 为体育筛选选项（透传 Kalshi `GET /search/filters_by_sport`，含 `filters_by_sports`、`sport_ordering`）。

---

### 3.8 Live Data（live_data.py）

#### GET /api/v1/live-data/{type}/milestone/{milestone_id}

**请求**：路径参数 `type`、`milestone_id`。

**响应**：`data` 为对应类型与里程碑的实时数据。

---

### 3.9 Incentives（incentives.py）

#### GET /api/v1/incentives

**请求**：`status`（string）、`type`（string）、`cursor`（string）。

**响应**：`data` 含激励计划列表及分页信息。

---

### 3.10 Multivariate（multivariate.py）

#### GET /api/v1/multivariate-event-collections

**请求**：`limit`（int）、`cursor`（string）。

**响应**：`data` 含多元事件集合列表及分页信息。

---

#### GET /api/v1/multivariate-event-collections/{ticker}

**请求**：路径参数 `ticker`。

**响应**：`data` 为单个多元事件集合对象。

---

### 3.11 Structured Targets（structured_targets.py）

#### GET /api/v1/structured-targets

**请求**：`limit`（int）、`cursor`（string）。

**响应**：`data` 含结构化目标列表及分页信息。

---

#### GET /api/v1/structured-targets/{target_id}

**请求**：路径参数 `target_id`。

**响应**：`data` 为单个结构化目标对象。

---

### 3.12 Sync（sync.py）

#### POST /api/v1/sync

**请求**：无 body；需配置 Supabase。

**响应**：`data` 含本次同步统计，如 `sync_type`, `started_at`, `finished_at`, `status`, `topics_count`。未配置 Supabase 时返回 503。

---

## 四、错误响应

```json
{
  "success": false,
  "error": {
    "code": "KALSHI_API_ERROR",
    "message": "Kalshi API error: ..."
  }
}
```

常见 code：`KALSHI_API_ERROR`（上游 Kalshi 错误）、`SUPABASE_NOT_CONFIGURED`（未配置 Supabase 时调同步）、`SYNC_ERROR`（同步异常）。

| HTTP 状态码 | 说明 |
|-------------|------|
| 200 | 成功 |
| 400 | 参数错误 |
| 404 | 资源不存在 |
| 500 | 服务端错误 |
| 502 | 代理 Kalshi 时上游错误 |
| 503 | 依赖未配置（如 Supabase） |

---

## 五、内部 API 与 Kalshi 映射

| 内部 API | Kalshi 调用 |
|----------|-------------|
| GET /api/v1/markets | [GET /markets](https://docs.kalshi.com/api-reference/market/get-markets)，参数透传（limit, cursor, event_ticker, series_ticker, status, tickers, min_created_ts, max_created_ts, min_updated_ts, min_close_ts, max_close_ts, min_settled_ts, max_settled_ts, mve_filter）；可选 sort 为本端二次排序 |
| GET /api/v1/markets/{ticker} | GET /markets/{ticker} |
| GET /api/v1/categories | 静态配置；按分类筛市场需先 GET /series?category=xxx 再 GET /markets?series_ticker=xxx |

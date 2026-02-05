# 技术栈与数据结构（接口规范）- 功能 2.2 市场列表页

- **版本**：v1
- **日期**：2025-02-05
- **适用功能**：2.2 市场列表页（首页 / 分类页）
- **说明**：本文档约定市场列表页所依赖的三个后端接口的请求参数与响应参数，含取值范围与注释。与 [01_requirements.md](01_requirements.md)、项目根目录 [04-API.md](../../04-API.md) 对齐。

---

## 一、通用说明

- **Base URL**
  - 生产：`https://kalshi-markets-production.up.railway.app`
  - 开发：`http://localhost:5000`
- **数据格式**：JSON，UTF-8
- **通用响应包装**
  - 成功：`{ "success": true, "data": {...} }`，业务数据在 `data` 中
  - 失败：`{ "success": false, "error": { "code": "string", "message": "string" } }`

---

## 二、GET /api/v1/categories

### 2.1 请求

| 项目 | 说明 |
|------|------|
| 方法 | GET |
| 路径 | `/api/v1/categories` |
| 请求参数 | 无 |

**注释**：分类列表用于首页分类栏展示。按分类筛选市场时，需先调 `GET /api/v1/series?category=xxx` 取得 series_ticker，再调 `GET /api/v1/markets?series_ticker=xxx` 或使用 `GET /api/v1/events?series_ticker=xxx`。

### 2.2 响应（data）

| 字段 | 类型 | 取值范围 | 注释 |
|------|------|----------|------|
| categories | array | — | 分类列表，当前后端返回约 10 项（含 "all"） |
| categories[].id | string | "all" \| "politics" \| "sports" \| "culture" \| "crypto" \| "climate" \| "economics" \| "companies" \| "financials" \| "science" | 分类唯一标识，用于 URL 路径（如 /category/politics）及 series 的 category 筛选 |
| categories[].label | string | 如 "All", "Politics", "Sports", "Tech & Science" | 展示名称，与 series 的 category 字段一致 |

---

## 三、GET /api/v1/series

### 3.1 请求

| 项目 | 说明 |
|------|------|
| 方法 | GET |
| 路径 | `/api/v1/series` |

**Query 参数**

| 参数 | 类型 | 必填 | 取值范围 | 注释 |
|------|------|------|----------|------|
| category | string | 否 | 与 categories[].label 一致，如 "Politics", "Sports", "Crypto", "Climate", "Economics", "Companies", "Financials", "Tech & Science"；传 "All" 或不传表示全部 | 按分类筛选系列 |
| tags | string | 否 | 具体以后端/业务为准 | 按标签筛选 |
| include_product_metadata | boolean | 否 | true \| false | 是否在每项 series 中包含 product_metadata 字段 |
| include_volume | boolean | 否 | true \| false | 是否包含 volume / volume_fp 等成交量字段 |

### 3.2 响应（data）

| 字段 | 类型 | 取值范围 | 注释 |
|------|------|----------|------|
| series | array | — | 系列列表 |
| series[].ticker | string | 非空，如 "KXBTCRESERVE" | 系列唯一标识，用于 events?series_ticker、markets?series_ticker |
| series[].title | string | — | 系列标题 |
| series[].category | string | "Politics" \| "Sports" \| "Culture" \| "Crypto" \| "Climate" \| "Economics" \| "Companies" \| "Financials" \| "Tech & Science" 等 | 分类，与 categories[].label 对应 |
| series[].frequency | string | — | 可选，系列频率描述 |
| series[].tags | array of string | — | 可选，标签数组 |
| series[].volume | number (integer) | ≥ 0 | 可选，总成交量（整数），需 include_volume=true 时常见 |
| series[].volume_fp | string | 数字字符串，≥ "0" | 可选，总成交量高精度字符串 |
| series[].product_metadata | object | — | 可选，产品元数据，需 include_product_metadata=true |
| series[].settlement_sources | array | [{ name, url }, …] | 可选，结算来源 |
| series[].contract_url | string | URL 或空 | 可选，合约链接 |
| series[].contract_terms_url | string | URL 或空 | 可选，条款链接 |
| series[].fee_type | string | — | 可选，费用类型 |
| series[].fee_multiplier | number | — | 可选，费用乘数 |
| series[].additional_prohibitions | array of string | — | 可选，额外禁止项 |

---

## 四、GET /api/v1/events

### 4.1 请求

| 项目 | 说明 |
|------|------|
| 方法 | GET |
| 路径 | `/api/v1/events` |

**Query 参数**

| 参数 | 类型 | 必填 | 取值范围 | 注释 |
|------|------|------|----------|------|
| limit | int | 否 | 1–200，默认由后端决定 | 每页事件条数 |
| cursor | string | 否 | 上页响应中的 data.cursor | 分页游标，用于下一页 |
| with_nested_markets | boolean | 否 | true \| false | 为 true 时，每个 event 下包含 markets 数组；列表页建议 true |
| with_milestones | boolean | 否 | true \| false | 是否在 data 中返回 milestones 数组 |
| status | string | 否 | "open" \| "closed" \| "settled" | 按事件状态筛选 |
| series_ticker | string | 否 | 如 "KXBTCRESERVE" | 按系列 ticker 筛选，仅返回该系列下事件 |
| min_close_ts | int | 否 | Unix 秒级时间戳 | 最小关闭时间，用于“即将到期”等场景 |

### 4.2 响应（data）顶层

| 字段 | 类型 | 取值范围 | 注释 |
|------|------|----------|------|
| events | array | — | 事件列表 |
| cursor | string | 空字符串或非空 | 分页游标，无更多时可为空 |
| milestones | array | — | 仅 when with_milestones=true 时存在；里程碑列表 |

### 4.3 Event 对象（data.events[]）

| 字段 | 类型 | 取值范围 | 注释 |
|------|------|----------|------|
| event_ticker | string | — | 事件唯一标识，如 "KXBTCRESERVE-27" |
| series_ticker | string | — | 所属系列 ticker |
| title | string | — | 事件标题 |
| sub_title | string | — | 副标题 |
| category | string | "Politics" \| "Sports" \| … | 分类 |
| mutually_exclusive | boolean | — | 该事件下市场是否互斥 |
| available_on_brokers | boolean | — | 是否在经纪商可用 |
| collateral_return_type | string | — | 可选，抵押返还类型 |
| strike_period | string | — | 可选，strike 周期 |
| anchors | string | — | 可选，锚点/依据说明（多行文本） |
| blindspots | string | — | 可选，盲区/风险说明 |
| product_metadata | object | — | 可选，产品元数据；可含 important_info 等 |
| reviewed_at | string | ISO 8601 日期时间 | 可选，审核时间 |
| markets | array | — | 仅 when with_nested_markets=true 时存在；该事件下的市场列表，见 4.4 |

### 4.4 Market 对象（data.events[].markets[]）

嵌套在事件下，用于列表页展示与跳转详情。

| 字段 | 类型 | 取值范围 | 注释 |
|------|------|----------|------|
| ticker | string | — | 市场唯一标识，如 "KXBTCRESERVE-27-JAN01" |
| event_ticker | string | — | 所属事件 ticker |
| title | string | — | 市场标题/问题 |
| subtitle | string | — | 可选，副标题 |
| yes_sub_title | string | — | Yes 选项副标题，如 "Before Jan 1, 2027" |
| no_sub_title | string | — | No 选项副标题 |
| market_type | string | 如 "binary" | 市场类型 |
| status | string | "active" \| "finalized" \| "open" \| "closed" \| "paused" \| "settled" 等 | 市场状态 |
| yes_bid | int | 0–100 | Yes 买价（分），1 分 = 0.01 美元 |
| yes_ask | int | 0–100 | Yes 卖价（分） |
| no_bid | int | 0–100 | No 买价（分） |
| no_ask | int | 0–100 | No 卖价（分） |
| yes_bid_dollars | string | "0.0000" 形式 | Yes 买价（美元） |
| yes_ask_dollars | string | "0.0000" 形式 | Yes 卖价（美元） |
| no_bid_dollars | string | "0.0000" 形式 | No 买价（美元） |
| no_ask_dollars | string | "0.0000" 形式 | No 卖价（美元） |
| last_price | int | 0–100 | 最新成交价（分） |
| last_price_dollars | string | "0.0000" 形式 | 最新成交价（美元） |
| previous_price | int | 0–100 | 可选，前一价格（分） |
| previous_price_dollars | string | — | 可选，前一价格（美元） |
| previous_yes_ask / previous_yes_bid / previous_yes_bid_dollars / previous_yes_ask_dollars | int / string | — | 可选，前一 Yes 买卖价 |
| volume | number (integer) | ≥ 0 | 总成交量 |
| volume_fp | string | 数字字符串 | 总成交量高精度 |
| volume_24h | number (integer) | ≥ 0 | 24 小时成交量 |
| volume_24h_fp | string | 数字字符串 | 24 小时成交量高精度 |
| open_interest | number (integer) | — | 未平仓数量 |
| open_interest_fp | string | — | 未平仓高精度 |
| notional_value | number (integer) | — | 名义价值（分） |
| notional_value_dollars | string | — | 名义价值（美元） |
| liquidity | number (integer) | 可为负 | 流动性（分） |
| liquidity_dollars | string | — | 流动性（美元） |
| close_time | string | ISO 8601 | 关闭时间 |
| open_time | string | ISO 8601 | 开放时间 |
| expiration_time | string | ISO 8601 | 到期时间 |
| expected_expiration_time | string | ISO 8601 | 预期到期时间 |
| latest_expiration_time | string | ISO 8601 | 最晚到期时间 |
| created_time | string | ISO 8601 或 "0001-01-01T00:00:00Z" | 创建时间 |
| updated_time | string | ISO 8601 或 "0001-01-01T00:00:00Z" | 更新时间 |
| can_close_early | boolean | — | 是否可提前关闭/平仓 |
| early_close_condition | string | — | 可选，提前关闭条件说明 |
| tick_size | int | 如 1 | 最小报价单位（分） |
| response_price_units | string | 如 "usd_cent" | 报价单位 |
| price_level_structure | string | 如 "linear_cent" | 价格层级结构 |
| price_ranges | array | [{ "start", "end", "step" }]，值为字符串如 "0.0000", "1.0000", "0.0100" | 价格区间与步长 |
| rules_primary | string | — | 规则主说明 |
| rules_secondary | string | — | 规则补充说明 |
| result | string | "yes" \| "no" \| "" | 已结算时的结果，未结算可为空 |
| settlement_value | int | 0 \| 1 等 | 可选，结算值（分） |
| settlement_value_dollars | string | — | 可选，结算值（美元） |
| settlement_timer_seconds | int | — | 可选，结算倒计时秒数 |
| expiration_value | string | — | 可选，到期值 |
| yes_calibration / no_calibration | int | — | 可选，校准值 |
| reviewed_at | string | ISO 8601 | 可选，审核时间 |

---

## 五、参考

- 需求： [01_requirements.md](01_requirements.md) 第 2.2 节
- 接口概览：项目根目录 [04-API.md](../../04-API.md)
- 表结构与字段说明：项目根目录 [05-SCHEMA.md](../../05-SCHEMA.md)

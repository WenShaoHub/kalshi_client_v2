# Kalshi 前端复刻需求规范（feature_0205_v1）

- **版本**：v1
- **日期**：2025-02-05
- **说明**：本规范遵循「规范驱动开发」（Spec-Driven Development）。编码前请以本文档为据；禁止无依据推测。若修改代码逻辑，需同步更新本规范文件（更新闭环）。

---

## 一、产品定位与范围

- 复刻 [kalshi.com](https://kalshi.com/) 前端：预测市场交易所 UI，包含市场列表、分类、Tab、卡片、Header/Footer、市场详情、交易面板等。
- **范围界定**：本期以「浏览与展示 + 交易面板 UI」为主；登录/注册、真实下单与资金流列为后续阶段。

---

## 二、功能点列表（分点）

### 2.1 导航与全局

- **顶部 Header**
  - Logo（链至首页 `/`）。
  - 主导航：Markets（`/category/all`）、Live（`/calendar`）、Ideas（`/ideas/feed`）、API（外链至 docs.kalshi.com，需 `target="_blank" rel="noopener noreferrer"`）。
  - 全局搜索：占位「Search markets or profiles」，后续接搜索 API。
  - 操作：Log in（`/sign-in`）、Sign up（`/sign-up`）。
- **Footer**
  - 监管说明（如 CFTC）、必要链接。
- **路由与 kalshi.com 一致**
  - `/` 首页；`/category/:categoryId` 分类页；`/calendar` Live 日历；`/ideas/feed` Ideas；`/markets/:id` 市场详情。
  - 外部链接使用 `target="_blank" rel="noopener noreferrer"`。

### 2.2 市场列表页（首页 / 分类页）

- **分类栏**
  - All + 10 个分类：Politics、Sports、Culture、Crypto、Climate、Economics、Mentions、Companies、Financials、Tech & Science。
  - 支持从后端 categories 动态拉取；无数据时使用默认列表。
- **列表 Tab**
  - Trending、New，对应列表排序/筛选（与 Series/Markets API 参数一致）。
- **市场卡片**
  - 事件副标题、标题、头图、选项（Yes/No）、成交量、NEW 角标、涨跌等；若有接口支持可展示 AI 概率列。
- **列表数据来源**
  - Series → Markets（或 Events → Markets），与项目 04-API.md、05-SCHEMA.md 层级一致。

### 2.3 市场详情页

- **事件头**
  - 分类、子类、标题、头图。
- **概率与图表**
  - 概率汇总、历史概率图表、成交量。
- **Chance 列表**
  - 各选项 Yes/No 价格、选中态、「More markets」链接。
- **交易面板**
  - Buy/Sell 切换、金额输入、Yes/No 按钮；本期为 UI，真实下单为后续阶段。
- **免责声明与 AI 分析**
  - 若有数据则展示对应区块。

### 2.4 Live（日历）

- **页面**：`/calendar`。
- **内容**：展示即将到期或进行中的市场/事件（可与 API 的 min_close_ts、status 等对应）。
- **实现**：可先静态或 mock，再接 API。

### 2.5 Ideas

- **页面**：`/ideas/feed`。
- **内容**：想法流/社区或观点类内容。
- **实现**：占位或简单列表，后续接社区/观点数据。

### 2.6 其他

- **Alpha 开关**：页面上可切换 Alpha 功能展示（若产品需要）。
- **无障碍与语义化**
  - 使用 `<header>`、`<main>`、`<nav>`、`<footer>`、`<section>`、`<article>`。
  - Tab 使用 `role="tablist"` 与 `aria-selected`。

---

## 三、用户故事（User Stories）

1. 作为访客，我希望在首页按分类（如 Politics）和 Tab（Trending/New）浏览市场卡片，以便快速发现感兴趣的事件。
2. 作为访客，我希望点击市场卡片进入详情页，查看事件说明、概率与图表、各选项价格，以便做出交易决策。
3. 作为访客，我可以在详情页使用交易面板选择 Buy/Sell、输入金额、点击 Yes/No 查看 UI 反馈（真实下单为后续阶段）。
4. 作为访客，我可以通过顶部导航进入 Live（日历）和 Ideas，了解即将到期或社区内容。
5. 作为访客，我可以通过 Header 搜索框进行搜索（当前可为占位，后续接搜索 API）。

---

## 四、非功能需求（简要）

- **技术栈**：Vite + React；样式为纯 CSS + CSS 变量（见 `src/styles/variables.css`）；与项目 .cursorrules 一致。
- **数据**：先 mock/静态；API 封装在 `src/lib/`，与 04-API.md 接口对齐，便于后续接真实后端。
- **规范**：若实现与本文档不一致，以本文档为准并同步更新代码或文档（更新闭环）。

---

## 五、参考与依赖

- **规范文件**：本文档（01_requirements.md）；接口与数据结构见项目根目录 04-API.md、05-SCHEMA.md。
- **设计参考**：kalshi.html、.cursorrules 中的 Kalshi brandkit（Inter、主色 #09C285 等）。


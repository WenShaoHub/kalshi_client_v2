# Kalshi 前端复刻 (Vite + React)

基于 kalshi.html 设计 token 与官网截图复刻的 Kalshi 预测市场 UI。

## 技术栈

- **构建**: Vite 5
- **框架**: React 18
- **样式**: 纯 CSS + Kalshi 设计 token（`src/styles/variables.css`）

## 项目结构

```
├── index.html
├── package.json
├── vite.config.js
├── kalshi.html           # 参考源码
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── styles/variables.css   # Kalshi palette
│   ├── components/
│   │   ├── Header.jsx     # Logo, Nav, Search, Sign up, Alpha toggle
│   │   ├── TabsBar.jsx   # Trending, New, All
│   │   ├── CategoryBar.jsx
│   │   ├── SubCategoryBar.jsx # Politics 子分类
│   │   ├── MarketCard.jsx
│   │   └── Footer.jsx
│   ├── pages/Home.jsx
│   └── lib/mockMarkets.js
└── public/
```

## 运行

```bash
npm install
npm run dev
```

开发服务器: http://localhost:5173

```bash
npm run build
npm run preview
```

## UI 说明

- **Header**: Kalshi Logo、Markets / Live(红) / Ideas / API、搜索框「Search markets or profiles」、Log in、Sign up(绿)、Alpha 开关
- **Tabs**: Trending、New、All（胶囊选中态）
- **主分类**: Politics 等，选中为底部粗边框 + 粗体
- **子分类**: All、US Elections、Primaries、Trump 等 + Sort/Filter
- **市场卡片**: 问题标题、多选项 + 百分比、Yes/No 小按钮、底部成交量 + 加号按钮，可选 NEW 标签与价格变化文案

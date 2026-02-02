/**
 * Mock market detail for Fed Chair example and fallback by id.
 * getMarketDetail(id) returns detail for id "1" or "fed-chair" or any known id; else null.
 */
const FED_CHAIR_DETAIL = {
  id: '1',
  title: 'Who will Trump nominate as Fed Chair?',
  category: 'Politics',
  subcategory: 'Trump',
  eventImage: 'https://picsum.photos/id/22/800/450',
  volume: '$111,443,587',
  disclaimer: 'The nomination must be formally transmitted to and received by the Senate.',
  aiAnalysis: '当前民调与事件模型下，Kevin Warsh 被提名概率最高；AI 综合历史提名与政策倾向，认为市场对 Warsh 的定价略偏保守，可关注听证会日程。',
  summaryCandidates: [
    { name: 'Kevin Warsh', pct: 35.9, colorKey: 'green' },
    { name: 'Judy Shelton', pct: 6.0, colorKey: 'blue' },
    { name: 'Rick Rieder', pct: null, colorKey: 'black' },
  ],
  chartData: {
    dates: ['2024-12', '2025-4', '2025-7', '2025-10', '2026-2'],
    series: [
      { candidateId: 'warsh', name: 'Kevin Warsh', colorKey: 'green', values: [20, 28, 32, 34, 35.9] },
      { candidateId: 'shelton', name: 'Judy Shelton', colorKey: 'blue', values: [8, 7, 6.5, 6.2, 6.0] },
      { candidateId: 'rieder', name: 'Rick Rieder', colorKey: 'black', values: [2, 1.5, 1, 0.5, 0] },
    ],
  },
  candidates: [
    {
      id: 'warsh',
      name: 'Kevin Warsh',
      avatar: 'https://picsum.photos/id/22/64/64',
      pct: 98,
      change: 1,
      changeDir: 'up',
      yesCents: 99,
      noCents: 2,
    },
    {
      id: 'shelton',
      name: 'Judy Shelton',
      avatar: 'https://picsum.photos/id/23/64/64',
      pct: 1,
      change: 1,
      changeDir: 'down',
      yesCents: 2,
      noCents: 99,
    },
    {
      id: 'rieder',
      name: 'Rick Rieder',
      avatar: 'https://picsum.photos/id/24/64/64',
      pct: '<1',
      change: null,
      changeDir: null,
      yesCents: 1,
      noCents: null,
    },
  ],
}

const DETAIL_BY_ID = {
  '1': FED_CHAIR_DETAIL,
  'fed-chair': FED_CHAIR_DETAIL,
  '2': { ...FED_CHAIR_DETAIL, id: '2' },
  '3': { ...FED_CHAIR_DETAIL, id: '3' },
  '4': { ...FED_CHAIR_DETAIL, id: '4' },
  '5': { ...FED_CHAIR_DETAIL, id: '5' },
  '6': { ...FED_CHAIR_DETAIL, id: '6' },
}

export function getMarketDetail(id) {
  if (!id) return null
  return DETAIL_BY_ID[id] || FED_CHAIR_DETAIL
}

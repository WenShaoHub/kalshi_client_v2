import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import TabsBar from '../components/TabsBar'
import CategoryBar from '../components/CategoryBar'
import SubCategoryBar from '../components/SubCategoryBar'
import MarketCard from '../components/MarketCard'
import Footer from '../components/Footer'
import AlphaToggle from '../components/AlphaToggle'
import { MOCK_MARKETS } from '../lib/mockMarkets'
import './Home.css'

const CATEGORY_LABELS = {
  politics: 'Politics',
  sports: 'Sports',
  culture: 'Culture',
  crypto: 'Crypto',
  climate: 'Climate',
  economics: 'Economics',
  mentions: 'Mentions',
  companies: 'Companies',
  financials: 'Financials',
  science: 'Tech & Science',
}

export default function Home() {
  const { categoryId } = useParams()
  const [activeTab, setActiveTab] = useState('trending')
  const [activeCategory, setActiveCategory] = useState('politics')
  const [activeSub, setActiveSub] = useState('for-you')
  const [alphaOn, setAlphaOn] = useState(false)

  /* /category/all 或 /category/:id 时以 URL 为准，否则用 tab/分类状态 */
  const fromCategoryRoute = categoryId != null
  const showAll = fromCategoryRoute ? categoryId === 'all' : activeTab === 'all'
  const effectiveCategory =
    fromCategoryRoute ? (categoryId === 'all' ? 'all' : categoryId) : activeCategory
  const effectiveTab = fromCategoryRoute && categoryId === 'all' ? 'all' : activeTab

  const filteredMarkets = showAll
    ? MOCK_MARKETS
    : MOCK_MARKETS.filter((m) => m.category === effectiveCategory)
  const sectionTitle = showAll ? 'All' : (CATEGORY_LABELS[effectiveCategory] ?? effectiveCategory)

  return (
    <>
      <Header />
      <main className="main">
        <section className="categories-row">
          <div className="categories-row-inner">
            <TabsBar activeTab={effectiveTab} onTabChange={setActiveTab} />
            <CategoryBar activeCategory={effectiveCategory} onCategoryChange={setActiveCategory} />
            <AlphaToggle alphaOn={alphaOn} onToggle={setAlphaOn} />
          </div>
        </section>
        <SubCategoryBar activeSub={activeSub} onSubChange={setActiveSub} />

        <section className="markets-section">
          <div className="markets-inner">
            <h1 className="section-title">{sectionTitle}</h1>
            <div className="market-list">
              {filteredMarkets.map((market) => (
                <Link key={market.id} to={`/markets/${market.id}`} className="market-card-link">
                  <MarketCard
                    eventSubtitle={market.eventSubtitle}
                    title={market.title}
                    eventImage={market.eventImage}
                    outcomes={market.outcomes}
                    volume={market.volume}
                    isNew={market.isNew}
                    priceChange={market.priceChange}
                    aiAnalysis={market.aiAnalysis}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

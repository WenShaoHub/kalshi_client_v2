import { useState } from 'react'
import Header from '../components/Header'
import TabsBar from '../components/TabsBar'
import CategoryBar from '../components/CategoryBar'
import SubCategoryBar from '../components/SubCategoryBar'
import MarketCard from '../components/MarketCard'
import Footer from '../components/Footer'
import { MOCK_MARKETS } from '../lib/mockMarkets'
import './Home.css'

export default function Home() {
  const [activeTab, setActiveTab] = useState('all')
  const [activeCategory, setActiveCategory] = useState('politics')
  const [activeSub, setActiveSub] = useState('all')

  return (
    <>
      <Header />
      <main className="main">
        <TabsBar activeTab={activeTab} onTabChange={setActiveTab} />
        <CategoryBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        <SubCategoryBar activeSub={activeSub} onSubChange={setActiveSub} />

        <section className="markets-section">
          <div className="markets-inner">
            <h1 className="section-title">Politics</h1>
            <div className="market-list">
              {MOCK_MARKETS.map((market) => (
                <MarketCard
                  key={market.id}
                  eventSubtitle={market.eventSubtitle}
                  title={market.title}
                  eventImage={market.eventImage}
                  outcomes={market.outcomes}
                  volume={market.volume}
                  isNew={market.isNew}
                  priceChange={market.priceChange}
                  aiAnalysis={market.aiAnalysis}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

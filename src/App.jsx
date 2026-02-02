import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MarketDetail from './pages/MarketDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:categoryId" element={<Home />} />
      <Route path="/markets/:id" element={<MarketDetail />} />
    </Routes>
  )
}

export default App

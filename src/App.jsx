import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MarketDetail from './pages/MarketDetail'
import Calendar from './pages/Calendar'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:categoryId" element={<Home />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/markets/:id" element={<MarketDetail />} />
    </Routes>
  )
}

export default App

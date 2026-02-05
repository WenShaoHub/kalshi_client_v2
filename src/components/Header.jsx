import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Header.css'

export default function Header() {
  const [searchValue, setSearchValue] = useState('')
  const location = useLocation()
  const pathname = location.pathname ?? ''
  const isCalendar = pathname === '/calendar'

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-text">Kalshi</span>
        </Link>
        <nav className="main-nav">
          <Link to="/category/all" className={`nav-link ${!isCalendar ? 'nav-link--active' : ''}`}>Markets</Link>
          <Link to="/calendar" className={`nav-link nav-link--live ${isCalendar ? 'nav-link--active' : ''}`}>Live</Link>
          <a href="/ideas/feed" className="nav-link">Ideas</a>
          <a href="https://docs.kalshi.com" className="nav-link" target="_blank" rel="noopener noreferrer">API</a>
        </nav>
        <div className="header-right">
          <div className="header-search">
            <span className="material-symbols-outlined search-icon">search</span>
            <input
              type="search"
              className="search-input"
              placeholder="Search markets or profiles"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              aria-label="Search markets or profiles"
            />
          </div>
          <div className="header-actions">
            <a href="/sign-in" className="btn btn--ghost">Log in</a>
            <a href="/sign-up" className="btn btn--primary">Sign up</a>
          </div>
        </div>
      </div>
    </header>
  )
}

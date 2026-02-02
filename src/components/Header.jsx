import { useState } from 'react'
import './Header.css'

export default function Header() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="/" className="logo">
          <span className="logo-text">Kalshi</span>
        </a>
        <nav className="main-nav">
          <a href="/category/all" className="nav-link nav-link--active">Markets</a>
          <a href="/calendar" className="nav-link nav-link--live">Live</a>
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

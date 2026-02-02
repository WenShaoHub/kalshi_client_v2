import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/careers">Careers</a>
          <a href="/blog">Blog</a>
          <a href="/help">Help</a>
          <a href="/legal">Legal</a>
        </div>
        <p className="footer-copy">
          Kalshi is a regulated exchange. U.S. regulatory oversight by the CFTC.
        </p>
      </div>
    </footer>
  )
}

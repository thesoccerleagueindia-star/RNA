import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  WHATSAPP_DISPLAY,
  media,
  navItems,
  whatsappLink,
} from '../data/content'

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const wa = whatsappLink(location.pathname)

  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <div className="site-header__inner">
          <Link to="/" className="brand-lockup" aria-label="AISE home">
            <img src={media.rsdlLogo} alt="" width={40} height={40} />
            <span className="brand-lockup__name">AISE</span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <Link to="/contact" className="button">
              Contact
            </Link>
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        <nav
          id="mobile-nav"
          className={`mobile-nav${menuOpen ? ' is-open' : ''}`}
          aria-label="Mobile"
        >
          {navItems.map((item) => (
            <NavLink key={item.href} to={item.href} end={item.href === '/'}>
              {item.label}
            </NavLink>
          ))}
          <a href={wa} target="_blank" rel="noreferrer">
            WhatsApp us
          </a>
        </nav>
      </header>

      <main id="main" className="main">
        <Outlet />
      </main>

      <a
        className="whatsapp-float"
        href={wa}
        target="_blank"
        rel="noreferrer"
        aria-label="Open WhatsApp with a message for this AISET service"
      >
        WhatsApp
      </a>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand-lockup" aria-label="AISE home">
              <img src={media.rsdlLogo} alt="" width={40} height={40} />
              <span className="brand-lockup__name">AISE</span>
            </Link>
            <p>
              Atletas India Sports and Entertainment Technology. Building
              meaningful sport experiences from India to the world.
            </p>
          </div>

          <div className="footer-col">
            <h3>Explore</h3>
            <Link to="/rising-star">Rising Star Development League</Link>
            <Link to="/rafa-nadal-academy">Rafa Nadal Academy</Link>
            <Link to="/athlexna">Athlexna</Link>
            <Link to="/isbi">International Sports Business Institute</Link>
            <Link to="/programmes">Training programmes</Link>
            <Link to="/sports-tours">Sports tours</Link>
          </div>

          <div className="footer-col">
            <h3>Connect</h3>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <a href={wa} target="_blank" rel="noreferrer">
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://www.aiseorg.info" target="_blank" rel="noreferrer">
              www.aiseorg.info
            </a>
            <Link to="/about">About AISET</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>© {new Date().getFullYear()} AISET / AISE. Sport. Technology. Possibility.</p>
          <p>India · Australia · Official agency of Rafa Nadal Academy by Movistar in India.</p>
        </div>
      </footer>
    </div>
  )
}

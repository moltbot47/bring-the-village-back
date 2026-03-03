import { ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface LayoutProps {
  children: ReactNode
}

const navLinkStyle: React.CSSProperties = {
  color: 'var(--text-muted)',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: 500,
}

const ctaBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '8px 16px',
  background: 'var(--orange)',
  color: 'white',
  borderRadius: '8px',
  fontWeight: 600,
  fontSize: '14px',
  textDecoration: 'none',
  border: '1.5px solid var(--orange-shadow)',
  boxShadow: '0 2px 0 var(--orange-shadow)',
  transform: 'translateY(-1px)',
  transition: 'all 0.1s',
}

export default function Layout({ children }: LayoutProps) {
  const { user, loading } = useAuth()
  const location = useLocation()
  const isLanding = location.pathname === '/'
  const [mobileOpen, setMobileOpen] = useState(false)

  const navContent = (
    <>
      {isLanding && (
        <>
          <a href="#how-it-works" style={navLinkStyle} onClick={() => setMobileOpen(false)}>How It Works</a>
          <a href="#support" style={navLinkStyle} onClick={() => setMobileOpen(false)}>Support Us</a>
        </>
      )}

      {!loading && (
        user ? (
          <Link to="/dashboard" style={ctaBtnStyle} onClick={() => setMobileOpen(false)}>
            Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" style={navLinkStyle} onClick={() => setMobileOpen(false)}>Sign In</Link>
            {isLanding ? (
              <a href="#waitlist" style={ctaBtnStyle} onClick={() => setMobileOpen(false)}>Join the Waitlist</a>
            ) : (
              <Link to="/register" style={ctaBtnStyle} onClick={() => setMobileOpen(false)}>Sign Up</Link>
            )}
          </>
        )
      )}
    </>
  )

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 var(--space-lg)',
          height: 'var(--header-height)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', textDecoration: 'none' }}>
          <span style={{ fontSize: '24px' }} role="img" aria-label="Village">
            🏘️
          </span>
          <span
            style={{
              fontWeight: 700,
              fontSize: '18px',
              color: 'var(--text-strong)',
              letterSpacing: '-0.01em',
            }}
          >
            Bring the Village Back
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="desktop-nav" aria-label="Main navigation" style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center' }}>
          {navContent}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="mobile-nav-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px',
            color: 'var(--text-strong)',
          }}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <nav
          className="mobile-nav-overlay"
          role="dialog"
          aria-label="Mobile navigation"
          style={{
            position: 'fixed',
            top: 'var(--header-height)',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--bg-surface)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-lg)',
            padding: 'var(--space-2xl) var(--space-lg)',
          }}
        >
          {navContent}
        </nav>
      )}

      <main id="main-content">{children}</main>

      <footer
        style={{
          background: 'var(--bg-dark)',
          color: 'var(--bg-accent)',
          padding: 'var(--space-2xl) var(--space-lg)',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <p style={{ fontWeight: 600, fontSize: '18px', color: 'var(--bg-surface)', marginBottom: 'var(--space-sm)' }}>
            Bring the Village Back
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-faint)', maxWidth: '500px', margin: '0 auto var(--space-lg)' }}>
            A community platform where single parents match and help each other.
            Because no one should have to do it alone.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-lg)', fontSize: '13px', flexWrap: 'wrap' }}>
            <a href="mailto:hello@bringthevillageback.org" style={{ color: 'var(--text-faint)' }}>
              Contact
            </a>
            <span style={{ color: 'var(--border-bold)' }}>|</span>
            <span style={{ color: 'var(--text-faint)' }}>Houston, TX</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--border-bold)', marginTop: 'var(--space-lg)' }}>
            Bring the Village Back is a community organization.
          </p>
        </div>
      </footer>

      {/* Mobile nav CSS */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: block !important; }
        }
      `}</style>
    </>
  )
}

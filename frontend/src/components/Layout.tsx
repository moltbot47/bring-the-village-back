import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
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
        </div>

        <nav style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'center' }}>
          <a
            href="#how-it-works"
            style={{
              color: 'var(--text-muted)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            How It Works
          </a>
          <a
            href="#support"
            style={{
              color: 'var(--text-muted)',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Support Us
          </a>
          <a
            href="#waitlist"
            style={{
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
            }}
          >
            Join the Waitlist
          </a>
        </nav>
      </header>

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
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-lg)', fontSize: '13px' }}>
            <a href="mailto:hello@bringthevillageback.org" style={{ color: 'var(--text-faint)' }}>
              Contact
            </a>
            <span style={{ color: 'var(--border-bold)' }}>|</span>
            <span style={{ color: 'var(--text-faint)' }}>
              Houston, TX
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--border-bold)', marginTop: 'var(--space-lg)' }}>
            Bring the Village Back is a community organization.
          </p>
        </div>
      </footer>
    </>
  )
}

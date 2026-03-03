import { useEffect, useState } from 'react'
import Card from '../components/Card'

interface HealthDetail {
  status: string
  version: string
  checks: {
    app: string
    database: string
  }
}

export default function Status() {
  const [health, setHealth] = useState<HealthDetail | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/health/detail/')
      .then(res => res.json())
      .then(data => { setHealth(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  const statusColor = error ? 'var(--red)' : health?.status === 'ok' ? 'var(--green)' : 'var(--orange)'
  const statusText = error ? 'Unreachable' : loading ? 'Checking...' : health?.status === 'ok' ? 'All Systems Operational' : 'Degraded'

  return (
    <div style={{ padding: 'var(--space-3xl) var(--space-lg)', background: 'var(--bg)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: 'var(--space-xl)' }}>
          System Status
        </h1>

        <Card style={{ padding: 'var(--space-xl)', textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: statusColor,
              display: 'inline-block',
              marginRight: 'var(--space-sm)',
              verticalAlign: 'middle',
            }}
            aria-hidden="true"
          />
          <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-strong)' }}>
            {statusText}
          </span>
          {health?.version && (
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: 'var(--space-sm)' }}>
              Version {health.version}
            </p>
          )}
        </Card>

        {health && (
          <Card style={{ padding: 'var(--space-lg)' }}>
            <h2 style={{ fontSize: '16px', marginBottom: 'var(--space-md)' }}>Service Checks</h2>
            {Object.entries(health.checks).map(([name, status]) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-sm) 0',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{name}</span>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: status === 'ok' ? 'var(--green)' : 'var(--red)',
                    padding: '2px 10px',
                    background: status === 'ok' ? 'var(--green-dim)' : 'var(--red-dim)',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {status === 'ok' ? 'Operational' : 'Issue'}
                </span>
              </div>
            ))}
          </Card>
        )}

        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)', marginTop: 'var(--space-lg)' }}>
          Checks run on page load. Refresh to re-check.
        </p>
      </div>
    </div>
  )
}

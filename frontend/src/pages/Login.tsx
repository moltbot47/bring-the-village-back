import { FormEvent, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button3D from '../components/Button3D'
import Card from '../components/Card'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1.5px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--bg-surface)',
  color: 'var(--text-strong)',
  fontSize: '15px',
  fontFamily: "'IBM Plex Sans', sans-serif",
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--text-strong)',
  marginBottom: '6px',
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await login(form)
      navigate('/dashboard')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: 'var(--space-3xl) var(--space-lg)', background: 'var(--bg)' }}>
      <div className="container" style={{ maxWidth: '420px' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>
          Welcome Back
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>
          Sign in to your village account.
        </p>

        <Card style={{ padding: 'var(--space-xl)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="email" style={labelStyle}>Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" value={form.email} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="password" style={labelStyle}>Password</label>
              <input id="password" name="password" type="password" required autoComplete="current-password" value={form.password} onChange={handleChange} style={inputStyle} />
            </div>

            {error && <div role="alert" style={{ color: 'var(--red)', fontSize: '14px', marginBottom: 'var(--space-md)', fontWeight: 500 }}>{error}</div>}

            <Button3D type="submit" size="lg" disabled={submitting} style={{ width: '100%' }}>
              {submitting ? 'Signing In...' : 'Sign In'}
            </Button3D>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', marginTop: 'var(--space-lg)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--orange)', fontWeight: 600 }}>Sign up</Link>
          </p>
        </Card>
      </div>
    </div>
  )
}

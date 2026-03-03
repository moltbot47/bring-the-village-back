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

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    display_name: '',
    zip_code: '',
    kids_ages: '',
    chapter: 'houston',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await register(form)
      navigate('/dashboard')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const data = (err as { response: { data: Record<string, string[]> } }).response.data
        setError(Object.values(data).flat()[0] || 'Registration failed.')
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: 'var(--space-3xl) var(--space-lg)', background: 'var(--bg)' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>
          Join the Village
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>
          Create your account to get matched with local parents.
        </p>

        <Card style={{ padding: 'var(--space-xl)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="display_name" style={labelStyle}>Your Name</label>
              <input id="display_name" name="display_name" type="text" required autoComplete="name" value={form.display_name} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="email" style={labelStyle}>Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" value={form.email} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="password" style={labelStyle}>Password</label>
              <input id="password" name="password" type="password" required autoComplete="new-password" minLength={8} value={form.password} onChange={handleChange} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <div>
                <label htmlFor="zip_code" style={labelStyle}>Zip Code</label>
                <input id="zip_code" name="zip_code" type="text" required autoComplete="postal-code" value={form.zip_code} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="chapter" style={labelStyle}>Chapter</label>
                <select id="chapter" name="chapter" value={form.chapter} onChange={handleChange} style={inputStyle}>
                  <option value="houston">Houston</option>
                  <option value="austin">Austin</option>
                  <option value="dallas">Dallas</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="kids_ages" style={labelStyle}>Kids' Ages</label>
              <input id="kids_ages" name="kids_ages" type="text" required placeholder="3, 7, 11" value={form.kids_ages} onChange={handleChange} style={inputStyle} />
            </div>

            {error && <div role="alert" style={{ color: 'var(--red)', fontSize: '14px', marginBottom: 'var(--space-md)', fontWeight: 500 }}>{error}</div>}

            <Button3D type="submit" size="lg" disabled={submitting} style={{ width: '100%' }}>
              {submitting ? 'Creating Account...' : 'Create Account'}
            </Button3D>
          </form>

          <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', marginTop: 'var(--space-lg)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--orange)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </Card>
      </div>
    </div>
  )
}

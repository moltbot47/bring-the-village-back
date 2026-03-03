import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../api/client'
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

const AVAILABILITY_OPTIONS = [
  { value: 'weekday_morning', label: 'Weekday Mornings' },
  { value: 'weekday_afternoon', label: 'Weekday Afternoons' },
  { value: 'weekday_evening', label: 'Weekday Evenings' },
  { value: 'weekend_morning', label: 'Weekend Mornings' },
  { value: 'weekend_afternoon', label: 'Weekend Afternoons' },
  { value: 'weekend_evening', label: 'Weekend Evenings' },
]

export default function EditProfile() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    display_name: user?.display_name || '',
    bio: user?.bio || '',
    zip_code: user?.zip_code || '',
    kids_ages: user?.kids_ages || '',
    needs: user?.needs || '',
    offers: user?.offers || '',
    availability: user?.availability || [],
    chapter: user?.chapter || 'houston',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!user) {
    navigate('/login')
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const toggleAvailability = (slot: string) => {
    setForm(prev => ({
      ...prev,
      availability: prev.availability.includes(slot)
        ? prev.availability.filter(s => s !== slot)
        : [...prev.availability, slot],
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await updateProfile({ ...form, is_onboarded: true })
      await refreshUser()
      navigate('/dashboard')
    } catch {
      setError('Failed to update profile. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ padding: 'var(--space-xl) var(--space-lg)', background: 'var(--bg)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-xl)' }}>Edit Profile</h1>

        <Card style={{ padding: 'var(--space-xl)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="display_name" style={labelStyle}>Display Name</label>
              <input id="display_name" name="display_name" type="text" required value={form.display_name} onChange={handleChange} style={inputStyle} />
            </div>

            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="bio" style={labelStyle}>Bio</label>
              <textarea id="bio" name="bio" value={form.bio} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Tell other parents a bit about yourself..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <div>
                <label htmlFor="zip_code" style={labelStyle}>Zip Code</label>
                <input id="zip_code" name="zip_code" type="text" required value={form.zip_code} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label htmlFor="kids_ages" style={labelStyle}>Kids' Ages</label>
                <input id="kids_ages" name="kids_ages" type="text" required value={form.kids_ages} onChange={handleChange} style={inputStyle} placeholder="3, 7, 11" />
              </div>
            </div>

            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="chapter" style={labelStyle}>Chapter</label>
              <select id="chapter" name="chapter" value={form.chapter} onChange={handleChange} style={inputStyle}>
                <option value="houston">Houston</option>
                <option value="austin">Austin</option>
                <option value="dallas">Dallas</option>
              </select>
            </div>

            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="needs" style={labelStyle}>What help do you need?</label>
              <textarea id="needs" name="needs" value={form.needs} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="e.g. Childcare while I study, help with cooking..." />
            </div>

            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="offers" style={labelStyle}>What can you offer?</label>
              <textarea id="offers" name="offers" value={form.offers} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="e.g. I can watch kids on weekends, tutoring..." />
            </div>

            <div style={{ marginBottom: 'var(--space-lg)' }}>
              <p style={labelStyle}>Availability</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
                {AVAILABILITY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleAvailability(opt.value)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: `1.5px solid ${form.availability.includes(opt.value) ? 'var(--orange)' : 'var(--border)'}`,
                      background: form.availability.includes(opt.value) ? 'var(--orange-dim)' : 'var(--bg-surface)',
                      color: form.availability.includes(opt.value) ? 'var(--orange-border)' : 'var(--text-muted)',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      fontFamily: "'IBM Plex Sans', sans-serif",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <div role="alert" style={{ color: 'var(--red)', fontSize: '14px', marginBottom: 'var(--space-md)', fontWeight: 500 }}>{error}</div>}

            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
              <Button3D type="submit" size="lg" disabled={submitting} style={{ flex: 1 }}>
                {submitting ? 'Saving...' : 'Save Profile'}
              </Button3D>
              <Button3D type="button" variant="secondary" size="lg" onClick={() => navigate('/dashboard')} style={{ flex: 1 }}>
                Cancel
              </Button3D>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

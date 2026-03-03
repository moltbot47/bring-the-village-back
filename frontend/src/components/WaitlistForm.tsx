import { FormEvent, useState } from 'react'
import { submitWaitlist, WaitlistData } from '../api/client'
import Button3D from './Button3D'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1.5px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--bg-surface)',
  color: 'var(--text-strong)',
  fontSize: '15px',
  fontFamily: "'IBM Plex Sans', sans-serif",
  transition: 'border-color 0.2s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--text-strong)',
  marginBottom: '6px',
}

const fieldStyle: React.CSSProperties = {
  marginBottom: 'var(--space-md)',
}

export default function WaitlistForm() {
  const [formData, setFormData] = useState<WaitlistData>({
    full_name: '',
    email: '',
    zip_code: '',
    kids_ages: '',
    needs: '',
    offers: '',
    chapter: 'houston',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    try {
      await submitWaitlist(formData)
      setStatus('success')
    } catch (err: unknown) {
      setStatus('error')
      if (err && typeof err === 'object' && 'response' in err) {
        const response = (err as { response: { data: Record<string, string[]> } }).response
        const data = response.data
        const firstError = Object.values(data).flat()[0]
        setErrorMsg(firstError || 'Something went wrong. Please try again.')
      } else {
        setErrorMsg('Something went wrong. Please try again.')
      }
    }
  }

  if (status === 'success') {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 'var(--space-2xl)',
          background: 'var(--green-dim)',
          borderRadius: 'var(--radius-lg)',
          border: '1.5px solid rgba(56, 134, 0, 0.2)',
        }}
      >
        <p style={{ fontSize: '24px', marginBottom: 'var(--space-sm)' }}>🎉</p>
        <h3 style={{ color: 'var(--green)', marginBottom: 'var(--space-sm)' }}>
          You're on the list!
        </h3>
        <p style={{ color: 'var(--text)' }}>
          We'll reach out soon as we launch in your area. Thank you for being part of the village.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-md)' }}>
        <div style={fieldStyle}>
          <label htmlFor="full_name" style={labelStyle}>Full Name</label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            value={formData.full_name}
            onChange={handleChange}
            style={inputStyle}
            placeholder="Your full name"
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="email" style={labelStyle}>Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            placeholder="you@email.com"
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="zip_code" style={labelStyle}>Zip Code</label>
          <input
            id="zip_code"
            name="zip_code"
            type="text"
            required
            value={formData.zip_code}
            onChange={handleChange}
            style={inputStyle}
            placeholder="77001"
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="kids_ages" style={labelStyle}>Kids' Ages</label>
          <input
            id="kids_ages"
            name="kids_ages"
            type="text"
            required
            value={formData.kids_ages}
            onChange={handleChange}
            style={inputStyle}
            placeholder="3, 7, 11"
          />
        </div>

        <div style={fieldStyle}>
          <label htmlFor="chapter" style={labelStyle}>Chapter</label>
          <select
            id="chapter"
            name="chapter"
            value={formData.chapter}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="houston">Houston</option>
            <option value="austin">Austin</option>
            <option value="dallas">Dallas</option>
          </select>
        </div>
      </div>

      <div style={fieldStyle}>
        <label htmlFor="needs" style={labelStyle}>What help do you need?</label>
        <textarea
          id="needs"
          name="needs"
          value={formData.needs}
          onChange={handleChange}
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          placeholder="e.g. Childcare while I study, help with cooking..."
        />
      </div>

      <div style={fieldStyle}>
        <label htmlFor="offers" style={labelStyle}>What can you offer?</label>
        <textarea
          id="offers"
          name="offers"
          value={formData.offers}
          onChange={handleChange}
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          placeholder="e.g. I can watch kids on weekends, help with tutoring..."
        />
      </div>

      {status === 'error' && (
        <div role="alert" style={{ color: 'var(--red)', fontSize: '14px', marginBottom: 'var(--space-md)', fontWeight: 500 }}>
          {errorMsg}
        </div>
      )}

      <Button3D
        type="submit"
        size="lg"
        disabled={status === 'submitting'}
        style={{ width: '100%', marginTop: 'var(--space-sm)' }}
      >
        {status === 'submitting' ? 'Joining...' : 'Join the Waitlist'}
      </Button3D>
    </form>
  )
}

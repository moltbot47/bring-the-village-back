import { FormEvent, useState } from 'react'
import api from '../api/client'
import Button3D from './Button3D'

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [category, setCategory] = useState('other')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setStatus('sending')
    try {
      await api.post('/feedback/', { text, category, source: 'widget' })
      setStatus('sent')
      setText('')
      setTimeout(() => { setOpen(false); setStatus('idle') }, 2000)
    } catch {
      setStatus('idle')
    }
  }

  return (
    <>
      {/* Floating feedback button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Give feedback"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--orange)',
          color: 'white',
          border: '2px solid var(--orange-shadow)',
          boxShadow: '0 3px 12px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          transition: 'transform 0.2s',
          transform: open ? 'rotate(45deg)' : 'none',
        }}
      >
        {open ? '+' : '💬'}
      </button>

      {/* Feedback panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: '84px',
            right: '24px',
            width: '320px',
            background: 'var(--bg-surface)',
            border: '1.5px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            padding: 'var(--space-lg)',
            zIndex: 200,
          }}
        >
          {status === 'sent' ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
              <p style={{ fontSize: '24px', marginBottom: 'var(--space-sm)' }}>🙏</p>
              <p style={{ fontWeight: 600, color: 'var(--green)' }}>Thanks for your feedback!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: 'var(--space-md)', color: 'var(--text-strong)' }}>
                Share Feedback
              </p>

              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  fontSize: '13px',
                  marginBottom: 'var(--space-sm)',
                  fontFamily: "'IBM Plex Sans', sans-serif",
                }}
              >
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="ux">UX / Design</option>
                <option value="safety">Safety Concern</option>
                <option value="praise">Praise</option>
                <option value="other">Other</option>
              </select>

              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Tell us what's on your mind..."
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  fontSize: '14px',
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  minHeight: '100px',
                  resize: 'vertical',
                  marginBottom: 'var(--space-md)',
                }}
              />

              <Button3D type="submit" size="sm" disabled={status === 'sending'} style={{ width: '100%' }}>
                {status === 'sending' ? 'Sending...' : 'Send Feedback'}
              </Button3D>
            </form>
          )}
        </div>
      )}
    </>
  )
}

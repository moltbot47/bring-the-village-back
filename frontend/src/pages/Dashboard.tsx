import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getTimeBankBalance, getConversations, TimeBankBalance } from '../api/client'
import Button3D from '../components/Button3D'
import Card from '../components/Card'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [balance, setBalance] = useState<TimeBankBalance | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) return
    getTimeBankBalance().then(res => setBalance(res.data)).catch(() => {})
    getConversations().then(res => {
      const total = res.data.conversations.reduce((sum, c) => sum + c.unread_count, 0)
      setUnreadCount(total)
    }).catch(() => {})
  }, [user])

  if (!user) {
    navigate('/login')
    return null
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <div style={{ padding: 'var(--space-xl) var(--space-lg)', background: 'var(--bg)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-xl)' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>
              Hey, {user.display_name}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
              {user.chapter.charAt(0).toUpperCase() + user.chapter.slice(1)} Chapter
            </p>
          </div>
          <Button3D variant="secondary" size="sm" onClick={handleLogout}>
            Sign Out
          </Button3D>
        </div>

        {!user.is_onboarded && (
          <Card highlighted style={{ marginBottom: 'var(--space-lg)', padding: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: '16px', marginBottom: 'var(--space-sm)' }}>
              Complete Your Profile
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
              Tell us what help you need and what you can offer so we can find your best matches.
            </p>
            <Button3D onClick={() => navigate('/profile/edit')} size="sm">
              Complete Profile
            </Button3D>
          </Card>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-md)' }}>
          <div onClick={() => navigate('/matches')} style={{ cursor: 'pointer' }}>
            <Card>
              <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>Matches</h3>
              <p className="mono" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--orange)' }}>
                Find
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Compatible parents near you
              </p>
            </Card>
          </div>

          <div onClick={() => navigate('/messages')} style={{ cursor: 'pointer' }}>
            <Card>
              <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>Messages</h3>
              <p className="mono" style={{ fontSize: '28px', fontWeight: 800, color: unreadCount > 0 ? 'var(--red)' : 'var(--text-strong)' }}>
                {unreadCount > 0 ? `${unreadCount} new` : 'Inbox'}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Chat with your connections
              </p>
            </Card>
          </div>

          <Card>
            <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>Time Bank</h3>
            <p className="mono" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-strong)' }}>
              {balance ? `${balance.balance >= 0 ? '+' : ''}${balance.balance} hrs` : '0 hrs'}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {balance ? `${balance.hours_given}h given, ${balance.hours_received}h received` : 'Give time, get time back'}
            </p>
          </Card>

          <Card>
            <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>Chapter</h3>
            <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-strong)' }}>
              {user.chapter.charAt(0).toUpperCase() + user.chapter.slice(1)}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Local events coming soon
            </p>
          </Card>
        </div>

        <Card style={{ marginTop: 'var(--space-lg)', padding: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: '16px', marginBottom: 'var(--space-sm)' }}>About You</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)', fontSize: '14px' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>Kids' Ages</p>
              <p style={{ fontWeight: 600 }}>{user.kids_ages || 'Not set'}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>Zip Code</p>
              <p style={{ fontWeight: 600 }}>{user.zip_code}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>I Need Help With</p>
              <p style={{ fontWeight: 600 }}>{user.needs || 'Not set yet'}</p>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>I Can Offer</p>
              <p style={{ fontWeight: 600 }}>{user.offers || 'Not set yet'}</p>
            </div>
          </div>
          <Button3D variant="secondary" size="sm" onClick={() => navigate('/profile/edit')} style={{ marginTop: 'var(--space-md)' }}>
            Edit Profile
          </Button3D>
        </Card>
      </div>
    </div>
  )
}

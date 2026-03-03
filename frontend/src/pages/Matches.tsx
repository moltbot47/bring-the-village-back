import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getMatchSuggestions,
  sendMatchRequest,
  getMyRequests,
  respondMatchRequest,
  getMyConnections,
  MatchSuggestion,
  MatchRequestItem,
  ConnectionItem,
} from '../api/client'
import Button3D from '../components/Button3D'
import Card from '../components/Card'

type Tab = 'suggestions' | 'requests' | 'connections'

export default function Matches() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('suggestions')
  const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([])
  const [incoming, setIncoming] = useState<MatchRequestItem[]>([])
  const [outgoing, setOutgoing] = useState<MatchRequestItem[]>([])
  const [connections, setConnections] = useState<ConnectionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sentIds, setSentIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    loadData()
  }, [user, navigate])

  const loadData = async () => {
    setLoading(true)
    try {
      const [sugRes, reqRes, connRes] = await Promise.all([
        getMatchSuggestions().catch(() => ({ data: { suggestions: [] } })),
        getMyRequests().catch(() => ({ data: { incoming: [], outgoing: [] } })),
        getMyConnections().catch(() => ({ data: { connections: [] } })),
      ])
      setSuggestions(sugRes.data.suggestions)
      setIncoming(reqRes.data.incoming)
      setOutgoing(reqRes.data.outgoing)
      setConnections(connRes.data.connections)
    } finally {
      setLoading(false)
    }
  }

  const handleSendRequest = async (toUserId: number) => {
    await sendMatchRequest(toUserId, "Hi! I'd love to connect and see how we can help each other.")
    setSentIds(prev => new Set(prev).add(toUserId))
  }

  const handleRespond = async (requestId: number, action: 'accept' | 'decline') => {
    await respondMatchRequest(requestId, action)
    await loadData()
  }

  if (!user) return null

  const tabStyle = (t: Tab): React.CSSProperties => ({
    padding: '12px 20px',
    color: tab === t ? 'var(--red)' : 'var(--text-muted)',
    borderBottom: `2px solid ${tab === t ? 'var(--red)' : 'transparent'}`,
    fontSize: '14px',
    fontWeight: tab === t ? 600 : 500,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: tab === t ? 'var(--red)' : 'transparent',
    fontFamily: "'IBM Plex Sans', sans-serif",
  })

  return (
    <div style={{ padding: 'var(--space-xl) var(--space-lg)', background: 'var(--bg)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-lg)' }}>Your Matches</h1>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', marginBottom: 'var(--space-xl)' }}>
          <button style={tabStyle('suggestions')} onClick={() => setTab('suggestions')}>
            Suggestions {suggestions.length > 0 && `(${suggestions.length})`}
          </button>
          <button style={tabStyle('requests')} onClick={() => setTab('requests')}>
            Requests {incoming.length > 0 && `(${incoming.length})`}
          </button>
          <button style={tabStyle('connections')} onClick={() => setTab('connections')}>
            Connections {connections.length > 0 && `(${connections.length})`}
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-2xl)' }}>Loading matches...</p>
        ) : (
          <>
            {/* SUGGESTIONS */}
            {tab === 'suggestions' && (
              <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
                {suggestions.length === 0 ? (
                  <Card style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
                    <p style={{ color: 'var(--text-muted)' }}>
                      {user.is_onboarded
                        ? 'No matches yet. More parents are joining every day!'
                        : 'Complete your profile to see matches.'}
                    </p>
                    {!user.is_onboarded && (
                      <Button3D onClick={() => navigate('/profile/edit')} size="sm" style={{ marginTop: 'var(--space-md)' }}>
                        Complete Profile
                      </Button3D>
                    )}
                  </Card>
                ) : (
                  suggestions.map(s => (
                    <Card key={s.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
                            <h3 style={{ fontSize: '16px' }}>{s.profile.display_name}</h3>
                            <span
                              className="mono"
                              style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                                background: s.total_score > 0.7 ? 'var(--green-dim)' : 'var(--orange-dim)',
                                color: s.total_score > 0.7 ? 'var(--green)' : 'var(--orange-border)',
                              }}
                            >
                              {Math.round(s.total_score * 100)}% match
                            </span>
                          </div>
                          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            Kids: {s.profile.kids_ages} | {s.profile.chapter}
                          </p>
                          {s.ai_reason && (
                            <p style={{ fontSize: '13px', color: 'var(--text)', fontStyle: 'italic', marginBottom: 'var(--space-sm)' }}>
                              "{s.ai_reason}"
                            </p>
                          )}
                          <div style={{ display: 'flex', gap: 'var(--space-md)', fontSize: '12px', color: 'var(--text-muted)' }}>
                            <span>Proximity: {Math.round(s.proximity_score * 100)}%</span>
                            <span>Ages: {Math.round(s.age_overlap_score * 100)}%</span>
                            <span>Schedule: {Math.round(s.schedule_score * 100)}%</span>
                          </div>
                        </div>
                        <Button3D
                          size="sm"
                          disabled={sentIds.has(s.profile.id)}
                          onClick={() => handleSendRequest(s.profile.id)}
                        >
                          {sentIds.has(s.profile.id) ? 'Sent!' : 'Connect'}
                        </Button3D>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* REQUESTS */}
            {tab === 'requests' && (
              <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
                <div>
                  <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                    Incoming ({incoming.length})
                  </h3>
                  {incoming.length === 0 ? (
                    <Card><p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No pending requests.</p></Card>
                  ) : (
                    incoming.map(req => (
                      <Card key={req.id} style={{ marginBottom: 'var(--space-sm)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ fontWeight: 600 }}>{req.from_user_name}</p>
                            {req.message && <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{req.message}</p>}
                          </div>
                          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                            <Button3D size="sm" onClick={() => handleRespond(req.id, 'accept')}>Accept</Button3D>
                            <Button3D size="sm" variant="secondary" onClick={() => handleRespond(req.id, 'decline')}>Decline</Button3D>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
                    Sent ({outgoing.length})
                  </h3>
                  {outgoing.length === 0 ? (
                    <Card><p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No sent requests.</p></Card>
                  ) : (
                    outgoing.map(req => (
                      <Card key={req.id} style={{ marginBottom: 'var(--space-sm)' }}>
                        <p><span style={{ fontWeight: 600 }}>{req.to_user_name}</span> — <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{req.status}</span></p>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* CONNECTIONS */}
            {tab === 'connections' && (
              <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
                {connections.length === 0 ? (
                  <Card style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No connections yet. Send a match request to get started!</p>
                  </Card>
                ) : (
                  connections.map(conn => (
                    <Card key={conn.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>{conn.display_name}</h3>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                            Kids: {conn.kids_ages} | {conn.chapter}
                          </p>
                          {conn.bio && <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{conn.bio}</p>}
                        </div>
                        <Button3D size="sm" variant="secondary" onClick={() => navigate(`/messages/${conn.user_id}`)}>
                          Message
                        </Button3D>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

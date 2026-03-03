import { useEffect, useState, useRef, FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getConversations,
  getMessages,
  sendMessage,
  ConversationItem,
  MessageItem,
} from '../api/client'
import Button3D from '../components/Button3D'
import Card from '../components/Card'

export default function Messages() {
  const { userId } = useParams<{ userId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [convos, setConvos] = useState<ConversationItem[]>([])
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [newMsg, setNewMsg] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const activeUserId = userId ? parseInt(userId) : null

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    getConversations().then(res => setConvos(res.data.conversations)).catch(() => {})
  }, [user, navigate])

  useEffect(() => {
    if (!activeUserId) return
    loadMessages()
    const interval = setInterval(loadMessages, 5000)
    return () => clearInterval(interval)
  }, [activeUserId])

  const loadMessages = async () => {
    if (!activeUserId) return
    const res = await getMessages(activeUserId)
    setMessages(res.data.messages)
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const handleSend = async (e: FormEvent) => {
    e.preventDefault()
    if (!activeUserId || !newMsg.trim()) return
    setSending(true)
    await sendMessage(activeUserId, newMsg.trim())
    setNewMsg('')
    await loadMessages()
    // Refresh convo list
    getConversations().then(res => setConvos(res.data.conversations)).catch(() => {})
    setSending(false)
  }

  if (!user) return null

  return (
    <div style={{ padding: 'var(--space-xl) var(--space-lg)', background: 'var(--bg)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: 'var(--space-lg)' }}>Messages</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--space-md)', minHeight: '500px' }}>
          {/* Conversation list */}
          <div style={{ borderRight: '1px solid var(--border-subtle)', paddingRight: 'var(--space-md)' }}>
            {convos.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                No conversations yet. Connect with a parent first!
              </p>
            ) : (
              convos.map(c => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/messages/${c.other_user_id}`)}
                  style={{
                    padding: 'var(--space-sm) var(--space-md)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    background: activeUserId === c.other_user_id ? 'var(--orange-dim)' : 'transparent',
                    marginBottom: '4px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-strong)' }}>
                      {c.other_user_name}
                    </p>
                    {c.unread_count > 0 && (
                      <span style={{
                        background: 'var(--orange)',
                        color: 'white',
                        borderRadius: 'var(--radius-full)',
                        padding: '2px 8px',
                        fontSize: '11px',
                        fontWeight: 700,
                      }}>
                        {c.unread_count}
                      </span>
                    )}
                  </div>
                  {c.last_message && (
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {c.last_message}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Message thread */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {!activeUserId ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <p style={{ color: 'var(--text-muted)' }}>Select a conversation</p>
              </div>
            ) : (
              <>
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: 'var(--space-md)',
                  maxHeight: '400px',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  {messages.length === 0 ? (
                    <Card style={{ textAlign: 'center' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                        Start the conversation! Say hello.
                      </p>
                    </Card>
                  ) : (
                    messages.map(m => (
                      <div
                        key={m.id}
                        style={{
                          display: 'flex',
                          justifyContent: m.is_mine ? 'flex-end' : 'flex-start',
                          marginBottom: 'var(--space-sm)',
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '70%',
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-lg)',
                            background: m.is_mine ? 'var(--orange)' : 'var(--bg-accent)',
                            color: m.is_mine ? 'white' : 'var(--text)',
                          }}
                        >
                          <p style={{ fontSize: '14px', lineHeight: 1.5 }}>{m.text}</p>
                          <p style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>

                <form onSubmit={handleSend} style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                  <input
                    type="text"
                    value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                    placeholder="Type a message..."
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '1.5px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface)',
                      fontSize: '15px',
                      fontFamily: "'IBM Plex Sans', sans-serif",
                    }}
                  />
                  <Button3D type="submit" disabled={sending || !newMsg.trim()}>
                    Send
                  </Button3D>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

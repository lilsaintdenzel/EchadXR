import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import { joinGroupSession, createGroupSession } from '../lib/api'

export default function GroupSession() {
  const { sessionId } = useParams()
  const { user } = useAuth()
  const [session, setSession] = useState(null)
  const [participants, setParticipants] = useState([])
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!sessionId) return

    // Load session details
    supabase
      .from('group_sessions')
      .select('*, scenes(title)')
      .eq('id', sessionId)
      .single()
      .then(({ data }) => setSession(data))

    // Subscribe to participant changes
    const channel = supabase
      .channel(`session:${sessionId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'session_participants',
        filter: `session_id=eq.${sessionId}`,
      }, () => {
        supabase
          .from('session_participants')
          .select('*, profiles(username)')
          .eq('session_id', sessionId)
          .then(({ data }) => setParticipants(data ?? []))
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [sessionId])

  const handleJoin = async () => {
    setError(null)
    const { error } = await joinGroupSession(joinCode.toUpperCase(), user.id)
    if (error) setError(typeof error === 'string' ? error : error.message)
  }

  if (!sessionId) {
    return (
      <div style={styles.page}>
        <h2 style={styles.title}>Join a Group Session</h2>
        <div style={styles.form}>
          <input
            style={styles.input}
            placeholder="Enter 6-digit code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            maxLength={6}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.button} onClick={handleJoin}>Join</button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>{session?.scenes?.title ?? 'Group Session'}</h2>
      <p style={styles.code}>Code: {session?.session_code}</p>
      <h3 style={{ color: '#d4b483', marginTop: '1rem' }}>Participants ({participants.length})</h3>
      <ul style={styles.list}>
        {participants.map((p) => (
          <li key={p.id} style={styles.participant}>
            {p.profiles?.username ?? p.user_id}
          </li>
        ))}
      </ul>
    </div>
  )
}

const styles = {
  page: { padding: '2rem', maxWidth: 600, margin: '0 auto' },
  title: { color: '#d4b483', marginBottom: '1rem' },
  code: { color: '#8a8a9a', fontFamily: 'monospace', fontSize: '1.25rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 300 },
  input: {
    padding: '0.75rem',
    background: '#13131a',
    border: '1px solid #2a2a3a',
    borderRadius: 4,
    color: '#f0ece0',
    fontSize: '1rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
  },
  error: { color: '#e57373', fontSize: '0.875rem' },
  button: {
    padding: '0.75rem',
    background: '#6b4f2a',
    color: '#f0ece0',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
  list: { listStyle: 'none', marginTop: '0.5rem' },
  participant: { padding: '0.5rem 0', borderBottom: '1px solid #2a2a3a', color: '#c0bca8' },
}

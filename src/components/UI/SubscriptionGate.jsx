import { useNavigate } from 'react-router-dom'

export default function SubscriptionGate({ sceneName }) {
  const navigate = useNavigate()

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h2 style={styles.title}>Unlock {sceneName}</h2>
        <p style={styles.body}>
          This scene is part of the full Echad XR experience.
          Subscribe to access all 5 immersive biblical scenes.
        </p>
        <ul style={styles.list}>
          <li>All 5 scenes unlocked</li>
          <li>Progress tracking</li>
          <li>Group session access</li>
        </ul>
        <button style={styles.button} onClick={() => navigate('/pricing')}>
          View Plans — from $14.99/yr
        </button>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  card: {
    background: '#13131a',
    border: '1px solid #2a2a3a',
    borderRadius: 12,
    padding: '2.5rem',
    maxWidth: 420,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  title: { color: '#d4b483' },
  body: { color: '#c0bca8', lineHeight: 1.6 },
  list: { color: '#c0bca8', paddingLeft: '1.25rem', lineHeight: 2 },
  button: {
    marginTop: '0.5rem',
    padding: '0.875rem',
    background: '#6b4f2a',
    color: '#f0ece0',
    border: 'none',
    borderRadius: 6,
    fontSize: '1rem',
    cursor: 'pointer',
  },
}

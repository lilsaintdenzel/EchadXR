import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

export default function LoginForm() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn(email, password)
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Sign In</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p style={styles.link}>
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: 400,
    margin: '10vh auto',
    padding: '2rem',
    background: '#13131a',
    borderRadius: 8,
    border: '1px solid #2a2a3a',
  },
  title: { marginBottom: '1.5rem', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: {
    padding: '0.75rem',
    background: '#0a0a0f',
    border: '1px solid #2a2a3a',
    borderRadius: 4,
    color: '#f0ece0',
    fontSize: '1rem',
  },
  error: { color: '#e57373', fontSize: '0.875rem' },
  button: {
    padding: '0.75rem',
    background: '#6b4f2a',
    color: '#f0ece0',
    border: 'none',
    borderRadius: 4,
    fontSize: '1rem',
    cursor: 'pointer',
  },
  link: { marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem' },
}

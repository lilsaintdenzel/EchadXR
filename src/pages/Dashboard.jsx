import { useEffect, useState } from 'react'
import { useAuth } from '../lib/auth'
import { getUserProgress } from '../lib/api'
import SceneSelector from '../components/UI/SceneSelector'
import ProgressTracker from '../components/UI/ProgressTracker'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [progress, setProgress] = useState([])

  useEffect(() => {
    if (user) {
      getUserProgress(user.id).then(setProgress)
    }
  }, [user])

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Echad XR</h1>
        <div style={styles.headerRight}>
          <span style={styles.email}>{user?.email}</span>
          <button style={styles.signOutBtn} onClick={signOut}>Sign Out</button>
        </div>
      </header>

      <main style={styles.main}>
        <section>
          <h2 style={styles.sectionTitle}>Scenes</h2>
          <SceneSelector userTier="free" />
        </section>

        <section style={{ marginTop: '2rem' }}>
          <ProgressTracker progress={progress} />
        </section>
      </main>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', flexDirection: 'column' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    borderBottom: '1px solid #2a2a3a',
  },
  logo: { color: '#d4b483', fontSize: '1.5rem' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  email: { color: '#8a8a9a', fontSize: '0.875rem' },
  signOutBtn: {
    background: 'transparent',
    border: '1px solid #2a2a3a',
    color: '#c0bca8',
    padding: '0.4rem 0.8rem',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  main: { padding: '2rem' },
  sectionTitle: { color: '#d4b483', marginBottom: '1rem' },
}

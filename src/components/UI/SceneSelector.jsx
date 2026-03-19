import { Link } from 'react-router-dom'

const SCENES = [
  { slug: 'gethsemane', title: 'Garden of Gethsemane', scripture: 'Matthew 26:36–46', free: true },
  { slug: 'upper-room', title: 'The Upper Room', scripture: 'John 13–17', free: false },
  { slug: 'calvary', title: 'Calvary', scripture: 'Luke 23:33–49', free: false },
  { slug: 'empty-tomb', title: 'The Empty Tomb', scripture: 'John 20:1–18', free: false },
  { slug: 'ascension', title: 'The Ascension', scripture: 'Acts 1:6–11', free: false },
]

export default function SceneSelector({ userTier = 'free' }) {
  const hasPaid = userTier !== 'free'

  return (
    <div style={styles.grid}>
      {SCENES.map((scene) => {
        const locked = !scene.free && !hasPaid
        return (
          <div key={scene.slug} style={{ ...styles.card, opacity: locked ? 0.5 : 1 }}>
            <p style={styles.scripture}>{scene.scripture}</p>
            <h3 style={styles.title}>{scene.title}</h3>
            {locked ? (
              <span style={styles.badge}>Paid</span>
            ) : (
              <Link to={`/scene/${scene.slug}`} style={styles.link}>
                Enter Scene →
              </Link>
            )}
          </div>
        )
      })}
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1.5rem',
    padding: '1rem',
  },
  card: {
    background: '#13131a',
    border: '1px solid #2a2a3a',
    borderRadius: 8,
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  scripture: { fontSize: '0.75rem', color: '#8a8a9a' },
  title: { fontSize: '1.1rem', color: '#d4b483' },
  badge: {
    fontSize: '0.75rem',
    background: '#2a2a3a',
    color: '#8a8a9a',
    padding: '0.25rem 0.5rem',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  link: { color: '#d4b483', textDecoration: 'none', fontSize: '0.875rem' },
}

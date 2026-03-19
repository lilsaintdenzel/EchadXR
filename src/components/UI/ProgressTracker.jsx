export default function ProgressTracker({ progress = [] }) {
  if (!progress.length) {
    return <p style={{ color: '#8a8a9a' }}>No scenes visited yet.</p>
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>Your Progress</h3>
      {progress.map((entry) => (
        <div key={entry.id} style={styles.row}>
          <span style={styles.scene}>{entry.scenes?.title ?? entry.scene_id}</span>
          <span style={styles.meta}>
            {entry.completed ? '✓ Completed' : `${Math.round(entry.time_spent / 60)} min`}
          </span>
        </div>
      ))}
    </div>
  )
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  heading: { marginBottom: '0.75rem', color: '#d4b483' },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #2a2a3a',
    fontSize: '0.875rem',
  },
  scene: { color: '#f0ece0' },
  meta: { color: '#8a8a9a' },
}

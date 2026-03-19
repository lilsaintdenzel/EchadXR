import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'

const SCENES = [
  {
    number: 'SCENE 01',
    title: 'Gethsemane',
    subtitle: 'The Garden of Surrender',
    scripture: 'Matthew 26:36-46',
    slug: 'gethsemane',
    description:
      'Where anguish met obedience. An olive press where pressure revealed what was inside. Walk among ancient trees under moonlight. Hear the prayer that changed everything.',
  },
  {
    number: 'SCENE 02',
    title: 'The Upper Room',
    subtitle: 'The Final Discourse',
    scripture: 'John 13–17',
    slug: 'upper-room',
    description:
      'Stone walls. Lamplight. The longest recorded prayer of Jesus. Stand where the Bread was broken. Listen to the words spoken before the cross.',
  },
  {
    number: 'SCENE 03',
    title: 'Mount of Beatitudes',
    subtitle: 'The Sermon on the Mount',
    scripture: 'Matthew 5–7',
    slug: null,
    description:
      'A hillside where the Kingdom was proclaimed. Each Beatitude a glowing node. Walk through the paradox: blessed are the meek, the mourners, the pure.',
  },
  {
    number: 'SCENE 04',
    title: 'Golgotha',
    subtitle: 'The Place of the Skull',
    scripture: 'Luke 23:33-49',
    slug: 'calvary',
    description:
      'Abstract. Reverent. Three crosses against darkness. The seven last sayings. Earthquake. Torn veil. The moment everything changed.',
  },
  {
    number: 'SCENE 05',
    title: 'The Empty Tomb',
    subtitle: 'Dawn of Resurrection',
    scripture: 'John 20:1-18',
    slug: 'empty-tomb',
    description:
      'White stone. Open mouth. No body. Dawn light pours in. Mary\u2019s encounter: \u201cRabboni.\u201d The most important empty space in history.',
  },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <>
      <div className="grid-bg" />
      <div className="glow" />

      <div className="particles">
        <div className="particle">אֶחָד</div>
        <div className="particle">יֵשׁוּעַ</div>
        <div className="particle">אֱמֶת</div>
        <div className="particle">רוּחַ</div>
      </div>

      <div className="page-container">
        <header className="site-header">
          <div className="logo">
            <span className="logo-text">PreachCode /</span>
            <span className="logo-hebrew">אֶחָד XR</span>
          </div>
        </header>

        {/* Hero */}
        <section className="hero">
          <div className="hero-label">Immersive Biblical Pilgrimage</div>
          <h1>ECHAD XR</h1>
          <p className="tagline">
            Enter sacred biblical locations in extended reality. Walk where Jesus walked.
            Encounter Scripture spatially. Experience the Testimony through presence.
          </p>
          <div className="cta-group">
            <Link to="/scene/gethsemane" className="btn btn-primary">
              Enter Gethsemane
            </Link>
            {user ? (
              <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
            ) : (
              <Link to="/signup" className="btn btn-secondary">Create Account</Link>
            )}
          </div>
        </section>

        {/* Scenes */}
        <section className="scenes-section" id="scenes">
          <div className="section-header">
            <div className="section-label">Five Sacred Scenes</div>
            <h2 className="section-title">A Journey Through the Passion</h2>
          </div>

          <div className="scene-grid">
            {SCENES.map((scene) =>
              scene.slug ? (
                <Link key={scene.number} to={`/scene/${scene.slug}`} className="scene-card">
                  <SceneCardContent scene={scene} />
                </Link>
              ) : (
                <div key={scene.number} className="scene-card">
                  <SceneCardContent scene={scene} />
                </div>
              )
            )}
          </div>
        </section>

        {/* Features */}
        <section className="features-section">
          <div className="page-container">
            <div className="section-header">
              <div className="section-label">How It Works</div>
              <h2 className="section-title">Cyber-Spiritual Immersion</h2>
            </div>

            <div className="feature-grid">
              <div className="feature">
                <div className="feature-icon">🌐</div>
                <h3 className="feature-title">WebXR Native</h3>
                <p className="feature-text">
                  Works in any browser. No app store. Desktop, mobile, or Meta Quest.
                  Progressive enhancement — everyone can access.
                </p>
              </div>

              <div className="feature">
                <div className="feature-icon">📖</div>
                <h3 className="feature-title">Spatial Scripture</h3>
                <p className="feature-text">
                  3D floating text. Hebrew overlays. Audio readings.
                  Scripture appears where it was spoken.
                </p>
              </div>

              <div className="feature">
                <div className="feature-icon">✝️</div>
                <h3 className="feature-title">Sacred Syntax Integration</h3>
                <p className="feature-text">
                  Each scene connects to PreachCode's theological meditations.
                  Depth over virality. Seeds over stats.
                </p>
              </div>

              <div className="feature">
                <div className="feature-icon">👥</div>
                <h3 className="feature-title">Group Experiences</h3>
                <p className="feature-text">
                  Churches, seminaries, small groups. Lead a group through scenes together.
                  Discipleship through presence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="site-footer">
          <div className="hebrew-accent">אֵל אֶחָד — The LORD is One</div>
          <div className="footer-links">
            <a href="https://preachcode.com" target="_blank" rel="noreferrer">PreachCode</a>
            <a href="https://sacred-syntax.com" target="_blank" rel="noreferrer">Sacred Syntax</a>
            <a href="https://youtube.com/@PreachCode" target="_blank" rel="noreferrer">YouTube</a>
            <a href="mailto:contact@echad-xr.com">Contact</a>
          </div>
          <p className="copyright">© 2026 PreachCode | The Testimony of Jesus through code</p>
        </footer>
      </div>
    </>
  )
}

function SceneCardContent({ scene }) {
  return (
    <>
      <div className="scene-number">{scene.number}</div>
      <h3 className="scene-title">{scene.title}</h3>
      <p className="scene-subtitle">{scene.subtitle}</p>
      <p className="scene-scripture">{scene.scripture}</p>
      <p className="scene-description">{scene.description}</p>
    </>
  )
}

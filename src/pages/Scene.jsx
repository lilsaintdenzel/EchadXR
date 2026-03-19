import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { canAccessScene, upsertProgress, getAllScenes } from '../lib/api'
import SceneWrapper from '../components/Scenes/SceneWrapper'
import Gethsemane from '../components/Scenes/Gethsemane'
import UpperRoom from '../components/Scenes/UpperRoom'
import SubscriptionGate from '../components/UI/SubscriptionGate'

const SCENE_COMPONENTS = {
  gethsemane: Gethsemane,
  'upper-room': UpperRoom,
}

// Fallback scene registry — used when Supabase is unavailable (no env, offline, etc.)
const LOCAL_SCENES = [
  { slug: 'gethsemane',  title: 'The Garden of Gethsemane', is_free: true,  id: 'local-1' },
  { slug: 'upper-room',  title: 'The Upper Room',            is_free: false, id: 'local-2' },
  { slug: 'calvary',     title: 'Calvary',                   is_free: false, id: 'local-3' },
  { slug: 'empty-tomb',  title: 'The Empty Tomb',            is_free: false, id: 'local-4' },
  { slug: 'ascension',   title: 'The Ascension',             is_free: false, id: 'local-5' },
]

export default function Scene() {
  const { slug } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [allowed, setAllowed] = useState(null)
  const [sceneData, setSceneData] = useState(null)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    async function checkAccess() {
      let scenes = await getAllScenes()
      if (!scenes.length) scenes = LOCAL_SCENES
      const scene = scenes.find((s) => s.slug === slug)
      if (!scene) { navigate('/'); return }
      setSceneData(scene)

      if (scene.is_free) {
        setAllowed(true)
      } else if (user) {
        const access = await canAccessScene(user.id, slug)
        setAllowed(access)
      } else {
        setAllowed(false)
      }
    }
    checkAccess()
  }, [slug, user])

  // Track time spent on unmount
  useEffect(() => {
    return () => {
      if (user && sceneData) {
        const seconds = Math.round((Date.now() - startTime) / 1000)
        upsertProgress(user.id, sceneData.id, {
          time_spent: seconds,
          last_visited: new Date().toISOString(),
        })
      }
    }
  }, [user, sceneData])

  const SceneComponent = SCENE_COMPONENTS[slug]

  if (allowed === null) return null
  if (!SceneComponent) return <p style={{ padding: '2rem' }}>Scene not found.</p>

  return (
    <>
      <SceneWrapper>
        <SceneComponent />
      </SceneWrapper>
      {!allowed && <SubscriptionGate sceneName={sceneData?.title ?? slug} />}
    </>
  )
}

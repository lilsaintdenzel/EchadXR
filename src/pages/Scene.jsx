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

export default function Scene() {
  const { slug } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [allowed, setAllowed] = useState(null)
  const [sceneData, setSceneData] = useState(null)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    async function checkAccess() {
      const scenes = await getAllScenes()
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

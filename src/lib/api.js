import { supabase } from './supabase'

export async function canAccessScene(userId, sceneSlug) {
  const { data: scene } = await supabase
    .from('scenes')
    .select('is_free')
    .eq('slug', sceneSlug)
    .single()

  if (!scene) return false
  if (scene.is_free) return true

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('status, expires_at')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  return sub && new Date(sub.expires_at) > new Date()
}

export async function getUserProgress(userId) {
  const { data } = await supabase
    .from('user_progress')
    .select('*, scenes(title, slug, scripture_ref)')
    .eq('user_id', userId)

  return data ?? []
}

export async function upsertProgress(userId, sceneId, updates) {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert({ user_id: userId, scene_id: sceneId, ...updates }, {
      onConflict: 'user_id,scene_id'
    })

  return { data, error }
}

export async function getAllScenes() {
  const { data } = await supabase
    .from('scenes')
    .select('*')
    .order('order_index')

  return data ?? []
}

export async function createGroupSession(leaderId, sceneId, maxParticipants = 20) {
  const sessionCode = Math.random().toString(36).substring(2, 8).toUpperCase()

  const { data, error } = await supabase
    .from('group_sessions')
    .insert({
      leader_id: leaderId,
      scene_id: sceneId,
      session_code: sessionCode,
      max_participants: maxParticipants,
    })
    .select()
    .single()

  return { data, error }
}

export async function joinGroupSession(sessionCode, userId) {
  const { data: session } = await supabase
    .from('group_sessions')
    .select('id')
    .eq('session_code', sessionCode)
    .single()

  if (!session) return { error: 'Session not found' }

  const { data, error } = await supabase
    .from('session_participants')
    .insert({ session_id: session.id, user_id: userId })
    .select()
    .single()

  return { data, error }
}

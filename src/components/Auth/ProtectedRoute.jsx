import { Navigate } from 'react-router-dom'
import { useAuth } from '../../lib/auth'

export const ProtectedRoute = ({ children, requiresPaid = false }) => {
  const { user, loading } = useAuth()

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>

  if (!user) return <Navigate to="/login" replace />

  // TODO: check subscription tier when requiresPaid is true
  // Query subscriptions table and redirect to /pricing if free

  return children
}

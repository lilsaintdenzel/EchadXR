import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/Auth/ProtectedRoute'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Scene from './pages/Scene'
import GroupSession from './pages/GroupSession'
import LoginForm from './components/Auth/LoginForm'
import SignupForm from './components/Auth/SignupForm'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/scene/:slug" element={<Scene />} />
      <Route
        path="/session/:sessionId"
        element={
          <ProtectedRoute>
            <GroupSession />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

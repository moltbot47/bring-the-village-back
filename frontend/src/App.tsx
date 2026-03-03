import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import EditProfile from './pages/EditProfile'
import Matches from './pages/Matches'
import Messages from './pages/Messages'
import FeedbackWidget from './components/FeedbackWidget'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:userId" element={<Messages />} />
          </Routes>
        </Layout>
        <FeedbackWidget />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

import { useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import './App.css'
import NewChat from './Components/Sidebar/NewChat'
import Recents from './Components/Sidebar/Recents'
import Chatarea from './Components/Mainpage/Chatarea'
import Signup from './Components/Signup/Signup'
import Login from './Components/Login/Login'
import Landing from './Components/Landing/Landing'
import Logo from './Components/Navbar/Logo'
import Profile from './Components/Navbar/Profile'
import Errorpage from './Components/ErrorPage/Errorpage'
import { useAuth } from './Contexts/AuthContext'
import { ChatProvider } from './Contexts/ChatContext'

function SearchWorkspace() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { currentUser, authLoading } = useAuth()
  const location = useLocation()

  if (authLoading) {
    return <div className="auth-loading-page">Loading your workspace...</div>
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return (
    <ChatProvider>
      <div className="Interface">
        <div className="content-row">
          {sidebarOpen && (
            <div
              className="sidebar-backdrop"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <div className={`sidebar-box ${sidebarOpen ? 'open' : ''}`}>
            <div className="workspace-sidebar-brand">
              <Logo />
            </div>
            <button
              className="sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
            >
              <CloseIcon fontSize="small" />
            </button>
            <NewChat onNavigate={() => setSidebarOpen(false)} />
            <Recents onNavigate={() => setSidebarOpen(false)} />
            <div className="workspace-sidebar-user">
              <Profile />
            </div>
          </div>
          <div className="mainbar-box">
            <button
              className="sidebar-toggle-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>
            <Chatarea />
          </div>
        </div>
      </div>
    </ChatProvider>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/search" element={<SearchWorkspace />} />
      <Route path="*" element={<Errorpage />} />
    </Routes>
  )
}

function App() {
  return <AppRoutes />
}

export default App

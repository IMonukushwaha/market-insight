import { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom"
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import './App.css'
import NewChat from './Components/Sidebar/NewChat'
import Recents from './Components/Sidebar/Recents'
import Chatarea from './Components/Mainpage/Chatarea'
import Signup from './Components/Signup/Signup'
import Login from './Components/Login/Login'
import Navbar from './Components/Navbar/Navbar'
import Errorpage from './Components/ErrorPage/Errorpage'
import { ChatProvider } from './Contexts/ChatContext'

function App() {
  const [data, setdata] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/`)
      .then(res => res.json())
      .then(data => setdata(data))
      .catch(err => console.error(err));
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <ChatProvider>
            <div className="Interface">
              <div className='navbar-box'>
                {}
                <button
                  className="sidebar-toggle-btn"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open menu"
                >
                  <MenuIcon />
                </button>
                <Navbar />
              </div>
              <div className="content-row">
                {sidebarOpen && (
                  <div
                    className="sidebar-backdrop"
                    onClick={() => setSidebarOpen(false)}
                  />
                )}
                <div className={`sidebar-box ${sidebarOpen ? "open" : ""}`}>
                  <button
                    className="sidebar-close-btn"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close menu"
                  >
                    <CloseIcon fontSize="small" />
                  </button>
                  <NewChat onNavigate={() => setSidebarOpen(false)} />
                  <Recents onNavigate={() => setSidebarOpen(false)} />
                </div>
                <div className="mainbar-box">
                  <Chatarea />
                </div>
              </div>
            </div>
          </ChatProvider>
        }
      />
      <Route path="*" element={<Errorpage />} />
    </Routes>
  )
}

export default App
import { useState, useEffect } from 'react'
import { Routes, Route } from "react-router-dom"
import './App.css'
import Response from './Components/Mainpage/Response'
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

  useEffect(()=> {
    fetch("http://localhost:5000/")
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
                <Navbar/>
              </div>
              <div className="content-row">
                <div className="sidebar-box">
                  <NewChat />
                  <Recents />
                </div>
                <div className="mainbar-box">
                  <Chatarea />
                </div>
              </div>
            </div>
          </ChatProvider>
        }
      />
      <Route path="*" element={<Errorpage/>} />
    </Routes>
  )
}

export default App
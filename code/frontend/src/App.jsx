import './App.css'
import React from 'react'
import LoginPage from './pages/login_register/LoginPage.jsx'
import Navbar from './pages/navbar/Navbar.jsx'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbar loginStatus={false} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reallybadchess" element={<Navbar loginStatus={false} />} />
        <Route path="/account" element={<Navbar loginStatus={true} />} />
        <Route path="/leaderboard" element={<Navbar loginStatus={true} />} />
        <Route path="/tournaments" element={<Navbar loginStatus={false} />} />
      </Routes>
    </Router>
  )
}

export default App

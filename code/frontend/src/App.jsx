import './App.css'
import React from 'react'
import LoginPage from './pages/login_register/LoginPage.jsx'
import Navbar from './pages/navbar/Navbar.jsx'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import StartInterface from './pages/chessboard/ChessStart.jsx';


function App() {
  const [loginStatus, setLoginStatus] = React.useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      setLoginStatus(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbar loginStatus={loginStatus} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reallybadchess" element={<StartInterface loginStatus={loginStatus} />} />
        <Route path="/account" element={<Navbar loginStatus={loginStatus} />} />
        <Route path="/leaderboard" element={<Navbar loginStatus={loginStatus} />} />
        <Route path="/tournaments" element={<Navbar loginStatus={loginStatus} />} />
      </Routes>
    </Router>
  )
}

export default App

import React from 'react'

import ReactDOM from 'react-dom/client'
import './index.css'

import LoginPage from './pages/login_register/LoginPage.jsx'
import Navbar from './pages/navbar/Navbar.jsx'
import StartInterface from './pages/chessboard/ChessStart.jsx'
import ErrorPage from './error-page.jsx'
import NavPage from './pages/common/NavPage.jsx'
import LandingPage from './pages/common/LandingPage.jsx'
import useTokenChecker from './utils/useTokenChecker.jsx';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import Cookies from 'js-cookie';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";



function App() {
  const router = createBrowserRouter([
    // Landing page
    {
      path: "/",
      element: <LandingPage />,
    },
    // Routes without a navbar on the side
    {
      path: "/login",
      element: <LoginPage/>,
    },
    // Routes with a navbar on the side
    {
      path: "/play",
      element: <NavPage />,
      children: [
        {
          path: "reallybadchess/",
          element: <StartInterface />,
        },
        {
          path: "account/",
          element: <></>,
        },
        {
          path: "leaderboard/",
          element: <></>,
        },
        {
          path: "tournaments/",
          element: <></>,
        }
      ]
    },
    {
      path: "*",
      element: <ErrorPage />,
    }
  ]);

  return (
    <RouterProvider router={router} />
  );
}


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

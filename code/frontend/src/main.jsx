import React from 'react'

import ReactDOM from 'react-dom/client'
import './index.css'

import LoginPage from './pages/login_register/LoginPage.jsx'
import ModeSelection from './pages/reallybadchess/ModeSelection.jsx'
import ErrorPage from './error-page.jsx'
import NavPage from './pages/common/NavPage.jsx'
import LandingPage from './pages/common/LandingPage.jsx'
import AccountPage from './pages/account/AccountPage.jsx';
import LeaderBoardPage from './pages/leaderboard/LeaderBoardPage.jsx';
import MobPage from './pages/mob/MobPage.jsx';
import AccountPageOthers from './pages/account/AccountPageOthers.jsx';
import ReallyBadChessLocal from './pages/reallybadchess/offline/ReallyBadChessLocal.jsx'
import ReallyBadChessLocalFreeplay from './pages/reallybadchess/freeplay/ReallyBadChessLocalFreeplay.jsx'
import ReallyBadChessOnline from './pages/reallybadchess/online/ReallyBadChessOnline.jsx'
import LobbyOnline from './pages/reallybadchess/online/LobbyOnline.jsx'
import Replay from './pages/replay/Replay.jsx'
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
      element: <LoginPage />,
    },
    {
      path: "/replay/:gameId",
      element: <Replay />,
    },
    // Routes with a navbar on the side
    {
      path: "/play",
      element: <NavPage />,
      children: [
        {
          path: "reallybadchess/",
          element: <ModeSelection />,
          children: [
            {
              path: ":gameId/",
              element: <ReallyBadChessOnline />,
            },
            {
              path: "local/",
              element: <ReallyBadChessLocal />,
            },
            {
              path: "freeplay/",
              element: <ReallyBadChessLocalFreeplay />,
            },
            {
              path: "lobby/",
              element: <LobbyOnline />,
            }
          ]
        },
        {
          path: "account/:username",
          element: <AccountPageOthers />,
        },
        {
          path: "account/",
          element: <AccountPage />,
        },
        {
          path: "leaderboard/",
          element: <LeaderBoardPage/>,
        },
        {
          path: "mob/",
          element: <MobPage/>,
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

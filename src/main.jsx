import './styles/globals.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Route, useParams } from "react-router-dom";
import useAuth, { AuthProvider } from './authentication/useAuth';

// Pages
import Root from './pages/Root';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ErrorPage from './pages/error-page';

// Components
import Search from './components/Search';
import Explore from './components/Explore';
import Home from './components/Home';
import Profile from './components/Profile';
import Chat from './components/Chat';

// Loaders
import { loader as userLoader } from './components/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'search',
        element: <Search />
      },
      {
        path: 'explore',
        element: <Explore />
      },
      {
        path: 'chat',
        element: <Chat />
      },
      {
        path: 'profile/:username', // Add the URL parameter ":username"
        element: <Profile />,
        loader:  userLoader,
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);

import './styles/globals.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import useAuth, {AuthProvider} from './authentication/useAuth';

import Login from './pages/Login.jsx'; 
import Landing from './pages/Landing.jsx';
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';

const router = createBrowserRouter([
  {
    path:'/',
    element: <Landing />
  },
  {
    path:'/login',
    element: <Login />
  },
  {
    path:'/signup',
    element: <Signup />
  },
  {
    path:'/home',
    element: <Home />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>    
  </React.StrictMode>
)

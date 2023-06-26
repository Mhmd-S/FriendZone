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
    path:'/',
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

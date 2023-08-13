import './styles/globals.css';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import { AuthProvider } from './authentication/useAuth';

// Pages
import Root from './pages/Root';
import Login from './pages/Login';
import Signup from './pages/Signup.jsx';
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
        errorElement: <ErrorPage />,
      },
      {
        path: 'home',
        element: <Home />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'search',
        element: <Search />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'explore',
        element: <Explore />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'chat',
        element: <Chat />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'profile/:username',
        element: <Profile />,
        errorElement: <ErrorPage />,
        loader:  userLoader,
      }
    ]
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/signup',
    element: <Signup />,
    errorElement: <ErrorPage />,
  },
  {
    path: '*', 
    element: <ErrorPage />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
);

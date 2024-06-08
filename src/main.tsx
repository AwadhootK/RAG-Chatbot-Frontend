import 'bootstrap/dist/css/bootstrap.css';
import Cookies from 'js-cookie';
import React, { ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';
import Chatbot from './components/Chatbot/Chatbot';
import Homepage from './components/HomePage/Homepage';
import LoginForm from './components/LoginSignup/LoginSignup';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginForm />,
    errorElement: <NotFoundPage />
  },
  {
    path: '/home',
    element: <ProtectedRoute><Homepage /></ProtectedRoute>,
    errorElement: <NotFoundPage />
  },
  {
    path: '/chat',
    element: <ProtectedRoute><Chatbot /></ProtectedRoute>,
    errorElement: <NotFoundPage />
  }
]);
interface ProtectedRouteProps {
  children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    console.log(token)

    if (token) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      navigate('/');
    }
  }, []);

  return authenticated ? children : null;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

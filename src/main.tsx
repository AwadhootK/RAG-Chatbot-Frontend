import 'bootstrap/dist/css/bootstrap.css';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';
import Homepage from './components/HomePage/Homepage';
import LoginForm from './components/LoginSignup/LoginSignup';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';

const router = createBrowserRouter([
  {
    'path': '/',
    element: <LoginForm />,
    errorElement: <NotFoundPage />
  },
  {
    'path': '/chat',
    element: <ProtectedRoute />,
    errorElement: <NotFoundPage />
  }
]);

function ProtectedRoute() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
      navigate('/');
    }
  }, [location.pathname]);

  return authenticated ? <Homepage /> : null;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

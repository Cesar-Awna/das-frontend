import { Outlet, Navigate } from 'react-router-dom';
import AppLayout from './layout/AppLayout.jsx';

const PrivateRoute = () => {
  const isAuthenticated = localStorage.getItem('user');
  console.log('PrivateRoute check:', { isAuthenticated, user: localStorage.getItem('user') });

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('Authenticated, rendering AppLayout');
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default PrivateRoute;

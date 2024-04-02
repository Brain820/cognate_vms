import { Navigate, Outlet } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import useAuth from './useAuth';
import Sidebar from '../../Home/Components/Sidebar';
import Header from '../../Home/Components/Header';

function Layout() {
  return (
    <>
      <Header />
      <Box className="te" height="90vh">
        <Sidebar />
        <Outlet />
      </Box>
    </>
  );
}

function RequireAuth() {
  // const { auth } = useAuth();
  // return localStorage.getItem('token') ? <Layout /> : <Navigate to="/login" />;
  // Checking if the token is expired
  const isTokenExpired = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        return exp * 1000 < Date.now();
      } catch (error) {
        return true;
      }
    }
    return true; // No token found
  };

  if (isTokenExpired()) {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  return <Layout />;
}

export default RequireAuth;

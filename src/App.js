import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Box, Spinner, Center, Text } from '@chakra-ui/react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';

// Componente de carga
const LoadingFallback = () => (
  <Center h="100vh">
    <Box textAlign="center">
      <Spinner size="xl" color="brand.500" thickness="4px" speed="0.65s" />
      <Text mt={4}>Cargando...</Text>
    </Box>
  </Center>
);

// Componente de ruta protegida
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  console.log('PrivateRoute - User:', user, 'Loading:', loading);
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        {/* Redirigir rutas desconocidas a la página principal */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { DreamProvider } from './contexts/DreamContext';
import { Box, Spinner, Center, Text } from '@chakra-ui/react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import AnalysisDetail from './pages/AnalysisDetail';
import DreamDetail from './pages/DreamDetail';

// Componente de carga
const LoadingFallback = () => (
  <Center h="100vh">
    <Box textAlign="center">
      <Spinner size="xl" color="teal.500" thickness="4px" speed="0.65s" />
      <Text mt={4}>Cargando...</Text>
    </Box>
  </Center>
);

// Componente de ruta protegida
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <DreamProvider>{children}</DreamProvider>;
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
        
        {/* Rutas protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/analysis" 
          element={
            <PrivateRoute>
              <Analysis />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/analysis/:dreamId" 
          element={
            <PrivateRoute>
              <AnalysisDetail />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/dream/:dreamId" 
          element={
            <PrivateRoute>
              <DreamDetail />
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
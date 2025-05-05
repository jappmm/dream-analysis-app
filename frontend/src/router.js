import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { Box, Spinner, Center } from '@chakra-ui/react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
// ... resto de importaciones ...
import { useDreams } from './contexts/DreamContext';

// Componente mejorado para rutas protegidas
const PrivateRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setAuthenticated(!!data.session);
      } catch (error) {
        console.error('Error checking auth:', error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }
  
  return authenticated ? children : <Navigate to="/login" replace />;
};

const AppRouter = () => {
  // El resto de tu código del router...
};

export default AppRouter;
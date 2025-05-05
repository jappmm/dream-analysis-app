// src/components/common/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Componente de protección de rutas privadas.
 * Redirige al login si el usuario no está autenticado.
 */
const PrivateRoute = ({ children }) => {
  const { user, isAuthenticating } = useAuth();

  if (isAuthenticating) return null; // O puedes poner un spinner

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

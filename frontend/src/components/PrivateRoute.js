// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';


const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // O puedes poner un spinner bonito aquí
  }

  // Si el usuario no está autenticado, redirige a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está autenticado, muestra el contenido protegido
  return <Outlet />;
};

export default PrivateRoute;

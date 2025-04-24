import React from 'react';
import { Route, Navigate } from 'react-router-dom'; // Actualización: importar Navigate
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ element: Component, ...rest }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // O puedes agregar un spinner o cualquier otra cosa mientras carga
  }

  return (
    <Route
      {...rest}
      element={
        user ? (
          Component
        ) : (
          <Navigate to="/login" /> // Usamos Navigate en lugar de Redirect
        )
      }
    />
  );
};

export default PrivateRoute;

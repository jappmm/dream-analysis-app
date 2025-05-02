import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Analysis from './pages/Analysis';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import About from './pages/About';
import Insights from './pages/Insights';
import NotFound from './pages/NotFound';
import RegisterDream from './pages/RegisterDream';
import DreamJournal from './pages/DreamJournal';
import { useDreams } from './contexts/DreamContext';  // Añadimos esta importación

// Componente para rutas protegidas usando Supabase
const PrivateRoute = ({ children }) => {
  // Ahora usamos el usuario de Supabase desde nuestro contexto
  const { user } = useDreams();
  
  if (!user) {
    // Si no hay usuario, redirigir a login
    return <Navigate to="/login" replace />;
  }
  // Si hay usuario, mostrar el contenido
  return children;
};

const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />
      
      {/* Rutas protegidas */}
      <Route path="/" element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      } />
      
      <Route path="/register-dream" element={
        <PrivateRoute>
          <RegisterDream />
        </PrivateRoute>
      } />
      
      <Route path="/history" element={
        <PrivateRoute>
          <DreamJournal />
        </PrivateRoute>
      } />
      
      <Route path="/analysis/:dreamId" element={
        <PrivateRoute>
          <Analysis />
        </PrivateRoute>
      } />
      
      <Route path="/profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
      
      <Route path="/settings" element={
        <PrivateRoute>
          <Settings />
        </PrivateRoute>
      } />
      
      <Route path="/insights" element={
        <PrivateRoute>
          <Insights />
        </PrivateRoute>
      } />
      
      {/* Ruta 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
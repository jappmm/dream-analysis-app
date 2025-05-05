// src/App.js
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword'; // ✅ añadido
import ResetPassword from './pages/ResetPassword';   // ✅ añadido
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { useEffect } from 'react';
import { testApiConnection } from './utils/testApiConnection';

function App() {
  useEffect(() => {
    testApiConnection();
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Área privada */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Cualquier ruta desconocida lleva a login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;

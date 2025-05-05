import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Comprobar si hay un usuario guardado en localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('dream_analysis_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Función simplificada de login - acepta cualquier credencial
  const login = async (email, password) => {
    try {
      // Simular un retraso
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Crear un usuario simulado
      const userData = {
        id: 'user_' + Date.now(),
        name: email.split('@')[0],
        email: email,
        createdAt: new Date().toISOString()
      };
      
      // Guardar en localStorage
      localStorage.setItem('dream_analysis_user', JSON.stringify(userData));
      localStorage.setItem('dream_analysis_token', 'fake_token_' + Date.now());
      
      // Actualizar estado
      setUser(userData);
      
      if (toast) {
        toast({
          title: 'Sesión iniciada',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error en login:', error);
      
      if (toast) {
        toast({
          title: 'Error al iniciar sesión',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
      
      return false;
    }
  };

  // Función de logout modificada para no redirigir automáticamente
  const logout = () => {
    localStorage.removeItem('dream_analysis_user');
    localStorage.removeItem('dream_analysis_token');
    setUser(null);
    
    if (toast) {
      toast({
        title: 'Sesión cerrada',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
    
    // No redirigir aquí, el sistema de rutas se encargará de esto
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated: isAuthenticated()
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
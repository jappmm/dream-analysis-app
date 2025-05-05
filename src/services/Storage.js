import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import Api from '../services/Api';
import Storage from '../services/Storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Verificar si hay una sesión existente al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = Storage.getStoredUser();
        const token = Storage.getStoredToken();
        
        if (storedUser && token) {
          // Establecer el usuario desde localStorage
          setUser(storedUser);
          Api.setAuthToken(token);
          
          // Opcionalmente verifica con el backend
          // Comentado por ahora para evitar errores de API
          /*
          try {
            const res = await Api.get('/auth/me');
            setUser(res.data);
          } catch (error) {
            console.error("Error verificando sesión:", error);
            // Si falla, mantener el usuario del localStorage
          }
          */
        }
      } catch (error) {
        console.error("Error cargando sesión:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Función de inicio de sesión
  const login = async (email, password, remember = false) => {
    try {
      // Para desarrollo, simulamos un login exitoso
      // En producción, descomenta el código que conecta con el backend
      
      // Simular respuesta exitosa
      const userData = {
        id: 'user_123',
        name: 'Usuario Demo',
        email: email,
        createdAt: new Date().toISOString(),
        settings: {
          notificationsEnabled: true,
          darkModeEnabled: false
        }
      };
      
      const fakeToken = 'fake-jwt-token-' + Math.random().toString(36).substring(2);
      
      // Guardar en localStorage
      Storage.setStoredUser(userData, fakeToken, remember);
      Api.setAuthToken(fakeToken);
      setUser(userData);
      
      toast({ 
        title: 'Sesión iniciada', 
        description: `Bienvenido, ${userData.name}`,
        status: 'success', 
        isClosable: true 
      });
      
      return true;
      
      /* CÓDIGO PARA PRODUCCIÓN:
      const res = await Api.post('/auth/login', { email, password });
      const { token, user: userData } = res.data;
      
      Storage.setStoredUser(userData, token, remember);
      Api.setAuthToken(token);
      setUser(userData);
      
      toast({ 
        title: 'Sesión iniciada', 
        status: 'success', 
        isClosable: true 
      });
      
      return true;
      */
      
    } catch (err) {
      toast({
        title: 'Error de login',
        description: err?.response?.data?.message || 'Credenciales incorrectas',
        status: 'error',
        isClosable: true,
      });
      return false;
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    Storage.removeStoredUser();
    Api.removeAuthToken();
    setUser(null);
    
    toast({ 
      title: 'Sesión cerrada', 
      status: 'info', 
      isClosable: true 
    });
    
    // Redireccionar al inicio podría ser necesario
    window.location.href = '/';
  };

  // Valores y funciones disponibles en el contexto
  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Verificar si hay una sesión activa al cargar la aplicación
    const getSession = async () => {
      try {
        console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
        console.log('Checking session...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setAuthError(error.message);
        }
        
        console.log('Session data:', session);
        setUser(session?.user || null);
        
        // Configurar listener para cambios en autenticación
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('Auth state change:', event, session);
            setUser(session?.user || null);
          }
        );

        return () => subscription.unsubscribe();
      } catch (err) {
        console.error('Auth provider error:', err);
        setAuthError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, []);

  // Función para registrar un nuevo usuario
  const signUp = async (email, password) => {
    setLoading(true);
    try {
      console.log('Signing up with:', email);
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        console.error('Signup error:', error);
        setAuthError(error.message);
        return { data, error };
      }
      
      console.log('Signup successful:', data);
      return { data, error: null };
    } catch (err) {
      console.error('Signup exception:', err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Función para iniciar sesión
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      console.log('Signing in with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Login error:', error);
        setAuthError(error.message);
        return { data, error };
      }
      
      console.log('Login successful:', data);
      setUser(data.user);
      return { data, error: null };
    } catch (err) {
      console.error('Login exception:', err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
        setAuthError(error.message);
        return { error };
      }
      
      console.log('Logout successful');
      setUser(null);
      return { error: null };
    } catch (err) {
      console.error('Logout exception:', err);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // Función para restablecer contraseña
  const resetPassword = async (email) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) {
        console.error('Reset password error:', error);
        setAuthError(error.message);
        return { data, error };
      }
      
      console.log('Reset password email sent');
      return { data, error: null };
    } catch (err) {
      console.error('Reset password exception:', err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar contraseña
  const updatePassword = async (password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        console.error('Update password error:', error);
        setAuthError(error.message);
        return { data, error };
      }
      
      console.log('Password updated successfully');
      return { data, error: null };
    } catch (err) {
      console.error('Update password exception:', err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    authError,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
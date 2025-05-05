import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../services/supabaseClient'; // Ajusta la ruta según tu estructura

// Crear el contexto
const DreamContext = createContext();

// Crear el proveedor del contexto
export const DreamProvider = ({ children }) => {
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Useeffect para manejar la autenticación
  useEffect(() => {
    // Establecer el estado inicial del usuario
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      
      if (!error && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };
    
    fetchUser();
    
    // Configurar un listener para cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`Auth event: ${event}`);
        setUser(session?.user || null);
      }
    );
    
    // Limpieza al desmontar el componente
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Funciones simuladas para desarrollo
  const addDream = async (dreamData) => {
    try {
      // Simulación de añadir un sueño
      const newDream = {
        id: Date.now().toString(),
        ...dreamData,
        created_at: new Date().toISOString(),
        user_id: user?.id || 'default-user'
      };
      
      setDreams([newDream, ...dreams]);
      return newDream;
    } catch (error) {
      setError("Error al añadir sueño");
      console.error('Error adding dream:', error);
      throw error;
    }
  };

  const updateDream = async (id, dreamData) => {
    try {
      // Simulación de actualizar un sueño
      const updatedDream = {
        ...dreams.find(dream => dream.id === id),
        ...dreamData,
        updated_at: new Date().toISOString()
      };
      
      setDreams(dreams.map(dream => dream.id === id ? updatedDream : dream));
      return updatedDream;
    } catch (error) {
      setError("Error al actualizar sueño");
      console.error('Error updating dream:', error);
      throw error;
    }
  };

  const deleteDream = async (id) => {
    try {
      // Simulación de eliminar un sueño
      setDreams(dreams.filter(dream => dream.id !== id));
    } catch (error) {
      setError("Error al eliminar sueño");
      console.error('Error deleting dream:', error);
      throw error;
    }
  };

  const getDream = async (id) => {
    try {
      // Simulación de obtener un sueño específico
      return dreams.find(dream => dream.id === id);
    } catch (error) {
      setError("Error al obtener sueño");
      console.error('Error fetching dream:', error);
      throw error;
    }
  };

  return (
    <DreamContext.Provider value={{
      dreams,
      loading,
      error,
      addDream,
      updateDream,
      deleteDream,
      getDream,
      user
    }}>
      {children}
    </DreamContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useDreams = () => {
  const context = useContext(DreamContext);
  if (!context) {
    throw new Error('useDreams debe ser usado dentro de un DreamProvider');
  }
  return context;
};

// Exportar el contexto como default export
export default DreamContext;
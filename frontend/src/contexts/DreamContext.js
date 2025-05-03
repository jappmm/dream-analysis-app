import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Crear el contexto
const DreamContext = createContext();

// Crear el proveedor del contexto
export const DreamProvider = ({ children }) => {
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Obtener el usuario actual
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, []);

  // Obtener los sueños del usuario
  useEffect(() => {
    const fetchDreams = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('dreams')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setDreams(data || []);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching dreams:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDreams();
    }
  }, [user]);

  // Añadir un nuevo sueño
  const addDream = async (dreamData) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const { data, error } = await supabase
        .from('dreams')
        .insert([{ ...dreamData, user_id: user.id }])
        .select();

      if (error) throw error;

      setDreams([data[0], ...dreams]);
      return data[0];
    } catch (error) {
      setError(error.message);
      console.error('Error adding dream:', error);
      throw error;
    }
  };

  // Actualizar un sueño existente
  const updateDream = async (id, dreamData) => {
    try {
      const { data, error } = await supabase
        .from('dreams')
        .update(dreamData)
        .eq('id', id)
        .select();

      if (error) throw error;

      setDreams(dreams.map(dream => dream.id === id ? data[0] : dream));
      return data[0];
    } catch (error) {
      setError(error.message);
      console.error('Error updating dream:', error);
      throw error;
    }
  };

  // Eliminar un sueño
  const deleteDream = async (id) => {
    try {
      const { error } = await supabase
        .from('dreams')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDreams(dreams.filter(dream => dream.id !== id));
    } catch (error) {
      setError(error.message);
      console.error('Error deleting dream:', error);
      throw error;
    }
  };

  // Obtener un sueño específico
  const getDream = async (id) => {
    try {
      const { data, error } = await supabase
        .from('dreams')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      setError(error.message);
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

// Exportar el contexto como default export (esto es lo que falta en tu código actual)
export default DreamContext;
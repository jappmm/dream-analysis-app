import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabaseClient'; // Importamos el cliente de Supabase

// Crear el contexto
export const DreamContext = createContext();

// Proveedor del contexto que maneja los sueños
export const DreamProvider = ({ children }) => {
  // Estado para almacenar los sueños
  const [dreams, setDreams] = useState([]);
  // Estado para manejar el estado de carga
  const [loading, setLoading] = useState(true);
  // Estado para el usuario actual
  const [user, setUser] = useState(null);

  // Verificar y establecer el usuario actual
  useEffect(() => {
    // Obtener la sesión actual
    const session = supabase.auth.getSession();
    setUser(session?.user || null);

    // Suscribirse a cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      // Limpiar suscripción
      if (authListener?.unsubscribe) authListener.unsubscribe();
    };
  }, []);

  // Cargar sueños desde Supabase cuando cambia el usuario
  useEffect(() => {
    const loadDreams = async () => {
      if (!user) {
        setDreams([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Consultar sueños del usuario actual
        const { data, error } = await supabase
          .from('dreams')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setDreams(data || []);
      } catch (error) {
        console.error('Error cargando sueños:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDreams();
  }, [user]);

  // Añadir un nuevo sueño
  const addDream = async (newDream) => {
    if (!user) return null;

    try {
      // Preparar el sueño para guardar
      const dreamWithMetadata = {
        user_id: user.id,
        title: newDream.title,
        content: newDream.content,
        created_at: new Date().toISOString(),
        // Solo añadir el análisis si existe
        ...(newDream.analysis && { analysis: newDream.analysis })
      };

      // Insertar en Supabase
      const { data, error } = await supabase
        .from('dreams')
        .insert([dreamWithMetadata])
        .select()
        .single();

      if (error) throw error;

      // Actualizar estado local
      setDreams(prevDreams => [data, ...prevDreams]);
      
      return data.id; // Devolver ID para redirecciones
    } catch (error) {
      console.error('Error añadiendo sueño:', error);
      return null;
    }
  };

  // Actualizar un sueño existente
  const updateDream = async (id, updatedDream) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('dreams')
        .update(updatedDream)
        .eq('id', id)
        .eq('user_id', user.id); // Asegurar que el sueño pertenece al usuario

      if (error) throw error;

      // Actualizar estado local
      setDreams(prevDreams => 
        prevDreams.map(dream => 
          dream.id === id ? { ...dream, ...updatedDream } : dream
        )
      );
      
      return true;
    } catch (error) {
      console.error('Error actualizando sueño:', error);
      return false;
    }
  };

  // Eliminar un sueño
  const deleteDream = async (id) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('dreams')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Asegurar que el sueño pertenece al usuario

      if (error) throw error;

      // Actualizar estado local
      setDreams(prevDreams => prevDreams.filter(dream => dream.id !== id));
      
      return true;
    } catch (error) {
      console.error('Error eliminando sueño:', error);
      return false;
    }
  };

  // Obtener un sueño específico
  const getDream = (id) => {
    return dreams.find(dream => dream.id === id);
  };

  // Exportar todos los sueños como JSON
  const exportDreams = () => {
    if (dreams.length === 0) return;
    
    const dataStr = JSON.stringify(dreams, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `dream_data_${new Date().toLocaleDateString()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Importar sueños desde un archivo JSON
  const importDreams = async (jsonData) => {
    if (!user) return { success: false, message: 'Debe iniciar sesión para importar datos' };

    try {
      const parsedData = JSON.parse(jsonData);
      
      if (!Array.isArray(parsedData)) {
        return { success: false, message: 'El formato del archivo no es válido' };
      }

      // Preparar los sueños para importar con el ID de usuario correcto
      const dreamsToImport = parsedData.map(dream => ({
        ...dream,
        user_id: user.id,
        id: undefined // Permitir que Supabase genere nuevos IDs
      }));

      // Insertar en Supabase
      const { data, error } = await supabase
        .from('dreams')
        .insert(dreamsToImport)
        .select();

      if (error) throw error;

      // Recargar los sueños
      const { data: allDreams, error: loadError } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (loadError) throw loadError;
      
      setDreams(allDreams || []);
      
      return { 
        success: true, 
        message: `${data.length} sueños importados correctamente` 
      };
    } catch (error) {
      console.error('Error importando sueños:', error);
      return { 
        success: false, 
        message: 'Error al procesar el archivo: ' + error.message 
      };
    }
  };

  // Funciones de autenticación
  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return { success: false, error: error.message };
    }
  };

  // Valores y funciones que se exponen al contexto
  const value = {
    dreams,
    loading,
    user,
    addDream,
    updateDream,
    deleteDream,
    getDream,
    exportDreams,
    importDreams,
    signUp,
    signIn,
    signOut
  };

  return (
    <DreamContext.Provider value={value}>
      {children}
    </DreamContext.Provider>
  );
};

// Hook personalizado para usar el contexto de los sueños
export const useDreams = () => {
  const context = useContext(DreamContext);
  if (context === undefined) {
    throw new Error('useDreams debe ser usado dentro de un DreamProvider');
  }
  return context;
};
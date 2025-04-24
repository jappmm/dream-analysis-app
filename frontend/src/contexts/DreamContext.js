// src/contexts/DreamContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const DreamContext = createContext();

// Hook personalizado para usar el contexto
export const useDreams = () => {
  const context = useContext(DreamContext);
  if (!context) {
    throw new Error('useDreams debe usarse dentro de un DreamProvider');
  }
  return context;
};

// Proveedor del contexto
export const DreamProvider = ({ children }) => {
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar sueños del localStorage al iniciar
  useEffect(() => {
    const storedDreams = localStorage.getItem('dreams');
    if (storedDreams) {
      setDreams(JSON.parse(storedDreams));
    }
  }, []);

  // Función para obtener todos los sueños
  const getDreams = async (userId, limit = 10) => {
    setLoading(true);
    try {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filtrar por usuario
      const storedDreams = JSON.parse(localStorage.getItem('dreams') || '[]');
      const userDreams = storedDreams
        .filter(dream => dream.userId === userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
      
      return userDreams;
    } catch (err) {
      console.error('Error al obtener sueños:', err);
      setError('Error al cargar los sueños');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener un sueño específico
  const getDreamById = async (dreamId) => {
    setLoading(true);
    try {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('Looking for dream with ID:', dreamId);
      
      const storedDreams = JSON.parse(localStorage.getItem('dreams') || '[]');
      const dream = storedDreams.find(dream => dream.id === dreamId);
      
      console.log('Available dreams:', storedDreams);
      console.log('Found dream:', dream);
      
      return dream || null;
    } catch (err) {
      console.error('Error al obtener sueño:', err);
      setError('Error al cargar el sueño');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Función para crear un nuevo sueño
  const createDream = async (dreamData) => {
    setLoading(true);
    try {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Crear nuevo sueño con ID único
      const newDream = {
        ...dreamData,
        id: 'dream_' + Date.now(),
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      
      // Obtener sueños existentes
      const storedDreams = JSON.parse(localStorage.getItem('dreams') || '[]');
      
      // Añadir el nuevo sueño
      const updatedDreams = [newDream, ...storedDreams];
      
      // Guardar en localStorage
      localStorage.setItem('dreams', JSON.stringify(updatedDreams));
      
      // Actualizar estado
      setDreams(updatedDreams);
      
      // Simular análisis automático después de 2 segundos
      setTimeout(() => {
        const dreamsInStorage = JSON.parse(localStorage.getItem('dreams') || '[]');
        const dreamIndex = dreamsInStorage.findIndex(d => d.id === newDream.id);
        
        if (dreamIndex !== -1) {
          dreamsInStorage[dreamIndex] = {
            ...dreamsInStorage[dreamIndex],
            status: 'analyzed',
            analysis: {
              summary: "Este sueño refleja aspectos de tu subconsciente relacionados con tus experiencias recientes.",
              symbols: [
                { name: "Símbolo 1", meaning: "Significado 1", context: "Contexto personal" },
                { name: "Símbolo 2", meaning: "Significado 2", context: "Contexto personal" }
              ],
              patterns: [
                { description: "Patrón 1", significance: "Significado del patrón 1" },
                { description: "Patrón 2", significance: "Significado del patrón 2" }
              ],
              reflectionQuestions: [
                "¿Cómo te sentiste durante el sueño?",
                "¿Reconoces estos símbolos en tu vida diaria?"
              ],
              recommendations: [
                "Recomendación 1 basada en el análisis",
                "Recomendación 2 basada en el análisis"
              ]
            }
          };
          
          localStorage.setItem('dreams', JSON.stringify(dreamsInStorage));
          setDreams(dreamsInStorage);
        }
      }, 2000);
      
      return newDream;
    } catch (err) {
      console.error('Error al crear sueño:', err);
      setError('Error al guardar el sueño');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para símbolos
  const getSymbols = async () => {
    // Simular delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Datos de ejemplo
    return [
      {
        _id: "Agua",
        count: 7,
        interpretations: [
          "Representa emociones y el inconsciente",
          "Agua clara puede simbolizar claridad mental",
          "Agua turbia puede indicar confusión emocional"
        ]
      },
      {
        _id: "Volar",
        count: 5,
        interpretations: [
          "Simboliza libertad y trascendencia",
          "Puede indicar deseo de escapar de limitaciones",
          "A veces representa perspectiva y visión amplia"
        ]
      },
      {
        _id: "Caída",
        count: 4,
        interpretations: [
          "Asociado con miedo al fracaso",
          "Puede reflejar ansiedad o inseguridad",
          "También puede simbolizar liberación"
        ]
      }
    ];
  };

  // Valores disponibles en el contexto
  const value = {
    dreams,
    loading,
    error,
    getDreams,
    getDreamById,
    createDream,
    getSymbols,
    refreshDreams: () => getDreams()
  };

  return (
    <DreamContext.Provider value={value}>
      {children}
    </DreamContext.Provider>
  );
};

export default DreamContext;
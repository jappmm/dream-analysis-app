// src/contexts/DreamContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';

const DreamContext = createContext();

export function DreamProvider({ children }) {
  const { user } = useAuth();
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [symbols, setSymbols] = useState({});
  const [patterns, setPatterns] = useState([]);

  // Cargar sueños cuando el usuario cambia
  useEffect(() => {
    if (user) {
      fetchDreams();
    } else {
      setDreams([]);
      setLoading(false);
    }
  }, [user]);

  // Obtener sueños del usuario
  const fetchDreams = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('Dreama')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDreams(data || []);
      
      // Analizar símbolos y patrones después de cargar los sueños
      if (data && data.length > 0) {
        analyzeSymbols(data);
        analyzePatterns(data);
      }
    } catch (err) {
      console.error('Error fetching dreams:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Guardar un nuevo sueño
  const saveDream = async (dreamData) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('Dreama')
        .insert([
          {
            title: dreamData.title,
            content: dreamData.content,
            dream_date: dreamData.date,
            user_id: user.id
          }
        ])
        .select();

      if (error) throw error;

      const newDreams = [data[0], ...dreams];
      setDreams(newDreams);
      
      // Actualizar análisis con el nuevo sueño
      analyzeSymbols(newDreams);
      analyzePatterns(newDreams);
      
      return { data: data[0], error: null };
    } catch (err) {
      console.error('Error saving dream:', err);
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Analizar símbolos recurrentes en los sueños
  const analyzeSymbols = (dreamsList) => {
    const symbolCount = {};
    const commonSymbols = [
      'agua', 'río', 'mar', 'océano', 'lluvia',
      'fuego', 'llamas', 'incendio',
      'aire', 'viento', 'tornado', 'huracán',
      'tierra', 'montaña', 'terremoto',
      'casa', 'edificio', 'habitación', 'puerta', 'ventana',
      'escalera', 'ascensor', 'pasillo',
      'escuela', 'trabajo', 'oficina',
      'coche', 'tren', 'avión', 'barco', 'vehículo',
      'animales', 'perro', 'gato', 'serpiente', 'caballo', 'pájaro',
      'caída', 'volar', 'correr', 'persecución',
      'dientes', 'cabello', 'cuerpo',
      'familia', 'madre', 'padre', 'hermano', 'hermana', 'hijo', 'hija',
      'amigo', 'extraño', 'enemigo',
      'sol', 'luna', 'estrellas', 'cielo', 'nubes',
      'muerte', 'nacimiento', 'boda', 'embarazo',
      'dinero', 'tesoro', 'pérdida'
    ];

    // Inicializar contador
    commonSymbols.forEach(symbol => {
      symbolCount[symbol] = 0;
    });

    // Contar ocurrencias de cada símbolo
    dreamsList.forEach(dream => {
      const content = dream.content.toLowerCase();
      commonSymbols.forEach(symbol => {
        // Buscar palabras completas con límites de palabras
        const regex = new RegExp(`\\b${symbol}\\b`, 'g');
        const matches = content.match(regex);
        if (matches) {
          symbolCount[symbol] += matches.length;
        }
      });
    });

    // Filtrar solo símbolos que aparecen
    const filteredSymbols = Object.entries(symbolCount)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    setSymbols(filteredSymbols);
  };

  // Analizar patrones en los sueños
  const analyzePatterns = (dreamsList) => {
    // Categorías de patrones
    const patternCategories = {
      recurrencia: {
        nombre: 'Sueños recurrentes',
        descripción: 'Sueños que se repiten con elementos similares',
        count: 0,
        sueños: []
      },
      lucidez: {
        nombre: 'Sueños lúcidos',
        descripción: 'Sueños donde eres consciente de que estás soñando',
        count: 0,
        sueños: []
      },
      persecución: {
        nombre: 'Sueños de persecución',
        descripción: 'Sueños donde te persiguen o huyes de algo',
        count: 0,
        sueños: []
      },
      caída: {
        nombre: 'Sueños de caída',
        descripción: 'Sueños donde experimentas la sensación de caer',
        count: 0,
        sueños: []
      },
      vuelo: {
        nombre: 'Sueños de vuelo',
        descripción: 'Sueños donde puedes volar o flotar',
        count: 0,
        sueños: []
      },
      ansiedad: {
        nombre: 'Sueños de ansiedad',
        descripción: 'Sueños donde experimentas ansiedad o estrés',
        count: 0,
        sueños: []
      }
    };

    // Palabras clave para cada categoría
    const keywords = {
      recurrencia: ['siempre', 'otra vez', 'mismo sueño', 'repetido', 'recurrente'],
      lucidez: ['darme cuenta', 'era consciente', 'saber que soñaba', 'control', 'lúcido'],
      persecución: ['perseguir', 'correr', 'escapar', 'huir', 'persecución', 'me seguía'],
      caída: ['caer', 'caída', 'precipicio', 'abismo', 'me caigo'],
      vuelo: ['volar', 'flotaba', 'elevaba', 'aire', 'volando'],
      ansiedad: ['miedo', 'ansiedad', 'estrés', 'angustia', 'preocupación', 'nervios', 'temor']
    };

    // Analizar cada sueño
    dreamsList.forEach(dream => {
      const content = dream.content.toLowerCase();
      
      // Revisar cada categoría
      Object.entries(keywords).forEach(([category, terms]) => {
        const found = terms.some(term => content.includes(term));
        if (found) {
          patternCategories[category].count += 1;
          if (!patternCategories[category].sueños.find(d => d.id === dream.id)) {
            patternCategories[category].sueños.push({
              id: dream.id,
              title: dream.title,
              date: dream.dream_date
            });
          }
        }
      });
    });

    // Convertir a array y ordenar por frecuencia
    const patternsArray = Object.values(patternCategories)
      .filter(pattern => pattern.count > 0)
      .sort((a, b) => b.count - a.count);

    setPatterns(patternsArray);
  };

  // Analizar un sueño individual
  const analyzeDream = (dreamContent) => {
    // Análisis de emociones
    const emotionKeywords = {
      alegría: ['feliz', 'alegre', 'contento', 'diversión', 'emocionado'],
      tristeza: ['triste', 'lloro', 'melancolía', 'deprimido', 'pena'],
      miedo: ['miedo', 'terror', 'pavor', 'asustado', 'horror'],
      ansiedad: ['ansioso', 'nervioso', 'preocupado', 'inquieto', 'intranquilo'],
      calma: ['calmado', 'tranquilo', 'paz', 'relajado', 'sereno'],
      ira: ['enfadado', 'enojado', 'ira', 'rabia', 'furia', 'molesto']
    };

    const content = dreamContent.toLowerCase();
    const emotions = {};
    
    Object.entries(emotionKeywords).forEach(([emotion, terms]) => {
      const count = terms.reduce((total, term) => {
        const regex = new RegExp(`\\b${term}\\b`, 'g');
        const matches = content.match(regex);
        return total + (matches ? matches.length : 0);
      }, 0);
      
      if (count > 0) {
        emotions[emotion] = count;
      }
    });

    // Interpretación general basada en símbolos comunes
    const interpretación = generateInterpretation(content);

    return {
      emotions,
      interpretación
    };
  };

  // Generar una interpretación básica basada en el contenido
  const generateInterpretation = (content) => {
    const interpretations = [];
    
    // Categorías de símbolos y sus interpretaciones
    const symbolMeanings = {
      agua: "El agua suele representar emociones y el estado del subconsciente. Aguas claras sugieren claridad emocional, mientras que aguas turbias pueden indicar confusión o emociones turbulentas.",
      caída: "Los sueños de caída a menudo reflejan inseguridades, pérdida de control o miedo al fracaso en algún aspecto de tu vida.",
      persecución: "Ser perseguido en sueños puede simbolizar que estás evitando un problema o situación en tu vida consciente que requiere tu atención.",
      vuelo: "Volar en sueños suele estar asociado con sentimientos de libertad, perspectiva y la capacidad de superar obstáculos. También puede representar aspiraciones y deseos de libertad.",
      dientes: "Soñar con dientes cayéndose o rompiéndose puede simbolizar inseguridades sobre tu apariencia, comunicación o miedo a perder poder o capacidad.",
      casa: "Las casas en los sueños representan a menudo aspectos de ti mismo. Diferentes habitaciones pueden simbolizar diferentes aspectos de tu personalidad o vida.",
      examen: "Los sueños sobre exámenes o pruebas suelen reflejar sentimientos de ser evaluado o juzgado, o miedos sobre preparación insuficiente para desafíos en la vida real."
    };

    // Revisar presencia de símbolos clave
    Object.entries(symbolMeanings).forEach(([symbol, meaning]) => {
      if (content.toLowerCase().includes(symbol)) {
        interpretations.push(meaning);
      }
    });

    // Si no se encontraron símbolos específicos
    if (interpretations.length === 0) {
      interpretations.push("Tu sueño contiene elementos personales que pueden tener significados únicos para ti. Reflexiona sobre cómo los elementos del sueño se relacionan con tu vida actual y tus emociones.");
    }

    return interpretations;
  };

  const value = {
    dreams,
    symbols,
    patterns,
    loading,
    error,
    fetchDreams,
    saveDream,
    analyzeDream
  };

  return <DreamContext.Provider value={value}>{children}</DreamContext.Provider>;
}

export function useDreams() {
  return useContext(DreamContext);
}
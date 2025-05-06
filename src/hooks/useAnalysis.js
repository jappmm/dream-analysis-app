// src/hooks/useAnalysis.js
import { useState, useEffect } from 'react';
import { useDreams } from '../contexts/DreamContext';

export function useAnalysis(dreamId = null) {
  const { dreams, symbols, patterns } = useDreams();
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const performAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        if (dreamId) {
          // Análisis de un sueño específico
          const dream = dreams.find(d => d.id === dreamId);
          if (!dream) {
            throw new Error('Sueño no encontrado');
          }

          // Emoción predominante
          const emotionAnalysis = analyzeEmotions(dream.content);
          
          // Símbolos destacados
          const symbolsFound = extractSymbols(dream.content);
          
          // Interpretación general
          const interpretation = generateInterpretation(dream.content, symbolsFound, emotionAnalysis);
          
          // Recomendaciones
          const recommendations = generateRecommendations(interpretation, emotionAnalysis.primaryEmotion);

          setAnalysisResults({
            dreamId,
            title: dream.title,
            date: dream.dream_date,
            emotions: emotionAnalysis,
            symbols: symbolsFound,
            interpretation,
            recommendations
          });
        } else {
          // Análisis general de todos los sueños
          
          // Tendencias emocionales
          const emotionTrends = analyzeEmotionTrends(dreams);
          
          // Símbolos recurrentes (ya calculados en DreamContext)
          
          // Patrones identificados (ya calculados en DreamContext)
          
          // Insights basados en todo el conjunto
          const insights = generateInsights(emotionTrends, symbols, patterns);

          setAnalysisResults({
            overview: true,
            emotionTrends,
            symbols,
            patterns,
            insights
          });
        }
      } catch (err) {
        console.error('Error in dream analysis:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (dreams.length > 0) {
      performAnalysis();
    } else {
      setLoading(false);
    }
  }, [dreamId, dreams, symbols, patterns]);

  // Analizador de emociones
  const analyzeEmotions = (content) => {
    const emotionKeywords = {
      alegría: ['feliz', 'alegre', 'contento', 'diversión', 'emocionado', 'positivo', 'satisfecho'],
      tristeza: ['triste', 'lloro', 'melancolía', 'deprimido', 'pena', 'desanimado', 'dolor'],
      miedo: ['miedo', 'terror', 'pavor', 'asustado', 'horror', 'temor', 'pánico'],
      ansiedad: ['ansioso', 'nervioso', 'preocupado', 'inquieto', 'intranquilo', 'estrés'],
      calma: ['calmado', 'tranquilo', 'paz', 'relajado', 'sereno', 'armónico'],
      ira: ['enfadado', 'enojado', 'ira', 'rabia', 'furia', 'molesto', 'irritado'],
      confusión: ['confundido', 'perdido', 'desorientado', 'extraño', 'incomprensible'],
      sorpresa: ['sorprendido', 'asombrado', 'impactado', 'inesperado', 'imprevisto']
    };

    const text = content.toLowerCase();
    const emotions = {};
    let totalEmotionWords = 0;
    
    // Contar ocurrencias de palabras emocionales
    Object.entries(emotionKeywords).forEach(([emotion, terms]) => {
      const count = terms.reduce((total, term) => {
        const regex = new RegExp(`\\b${term}\\b`, 'g');
        const matches = text.match(regex);
        return total + (matches ? matches.length : 0);
      }, 0);
      
      if (count > 0) {
        emotions[emotion] = count;
        totalEmotionWords += count;
      }
    });
    
    // Calcular proporciones
    const emotionPercentages = {};
    let primaryEmotion = 'neutral';
    let maxCount = 0;
    
    if (totalEmotionWords > 0) {
      Object.entries(emotions).forEach(([emotion, count]) => {
        const percentage = (count / totalEmotionWords) * 100;
        emotionPercentages[emotion] = Math.round(percentage);
        
        if (count > maxCount) {
          maxCount = count;
          primaryEmotion = emotion;
        }
      });
    }
    
    return {
      detected: Object.keys(emotions).length > 0,
      primaryEmotion,
      emotions: emotionPercentages,
      intensity: calculateEmotionIntensity(text, emotions)
    };
  };
  
  // Calculador de intensidad emocional
  const calculateEmotionIntensity = (text, emotions) => {
    // Intensificadores emocionales
    const intensifiers = ['muy', 'extremadamente', 'increíblemente', 'totalmente', 'completamente', 'absolutamente'];
    
    // Contar intensificadores
    const intensifierCount = intensifiers.reduce((count, word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = text.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
    
    // Signos de exclamación
    const exclamationCount = (text.match(/!/g) || []).length;
    
    // Total de emociones detectadas
    const emotionCount = Object.values(emotions).reduce((sum, count) => sum + count, 0);
    
    // Longitud del texto (para normalizar)
    const wordCount = text.split(/\s+/).length;
    
    // Fórmula para calcular intensidad (0-10)
    const rawIntensity = ((emotionCount * 2) + (intensifierCount * 3) + exclamationCount) / (wordCount / 10);
    
    // Limitar a rango 0-10 y redondear
    return Math.min(10, Math.max(0, Math.round(rawIntensity * 10) / 10));
  };

  // Extractor de símbolos
  const extractSymbols = (content) => {
    const commonSymbols = {
      agua: ['agua', 'río', 'mar', 'océano', 'lago', 'lluvia', 'piscina'],
      fuego: ['fuego', 'llamas', 'incendio', 'quemar', 'arder'],
      aire: ['aire', 'viento', 'tornado', 'huracán', 'brisa'],
      tierra: ['tierra', 'montaña', 'terremoto', 'cueva', 'arena'],
      casa: ['casa', 'edificio', 'habitación', 'puerta', 'ventana', 'hogar'],
      viaje: ['viaje', 'camino', 'ruta', 'trayecto', 'destino'],
      vehículos: ['coche', 'tren', 'avión', 'barco', 'bicicleta'],
      animales: ['animal', 'perro', 'gato', 'serpiente', 'caballo', 'pájaro', 'lobo'],
      personas: ['persona', 'gente', 'multitud', 'desconocido', 'extraño'],
      familia: ['familia', 'madre', 'padre', 'hermano', 'hermana', 'hijo', 'hija'],
      muerte: ['muerte', 'morir', 'fallecimiento', 'funeral', 'cementerio'],
      cuerpo: ['cuerpo', 'mano', 'cabeza', 'dientes', 'cabello', 'sangre'],
      caída: ['caer', 'caída', 'precipicio', 'abismo'],
      vuelo: ['volar', 'flotar', 'elevarse', 'levitar'],
      persecución: ['perseguir', 'persecución', 'huir', 'escapar', 'correr'],
      transformación: ['cambiar', 'transformar', 'convertir', 'metamorfosis']
    };
    
    const text = content.toLowerCase();
    const foundSymbols = {};
    
    // Identificar símbolos presentes
    Object.entries(commonSymbols).forEach(([category, terms]) => {
      const matches = terms.filter(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'g');
        return text.match(regex);
      });
      
      if (matches.length > 0) {
        foundSymbols[category] = {
          count: matches.length,
          terms: matches
        };
      }
    });
    
    // Ordenar por relevancia
    return Object.entries(foundSymbols)
      .sort((a, b) => b[1].count - a[1].count)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  };

  // Generador de interpretación
  const generateInterpretation = (content, symbols, emotionAnalysis) => {
    const interpretations = [];
    
    // Interpretaciones basadas en símbolos
    const symbolMeanings = {
      agua: "El agua representa tus emociones y el estado de tu subconsciente. Su estado (clara, turbia, calmada, agitada) refleja tu estado emocional.",
      fuego: "El fuego puede simbolizar transformación, pasión, deseo o destrucción. Considéralo en el contexto de cómo te sentías en el sueño.",
      casa: "Las casas en los sueños suelen representar diferentes aspectos de ti mismo. Explorar una casa puede significar exploración personal o autodescubrimiento.",
      viaje: "Los viajes simbolizan tu camino en la vida o la dirección que estás tomando. Presta atención a los obstáculos o ayudas que encuentras.",
      vehículos: "Los vehículos representan cómo te mueves por la vida. Problemas con vehículos pueden indicar preocupaciones sobre tu progreso o dirección.",
      animales: "Los animales a menudo representan cualidades que reconoces en ti mismo o en otros, o instintos naturales que estás experimentando.",
      caída: "La sensación de caer suele relacionarse con inseguridades, falta de control o miedo al fracaso en algún aspecto de tu vida.",
      vuelo: "Volar en sueños representa libertad, perspectiva, y la capacidad de elevarte por encima de los problemas. También puede simbolizar aspiraciones.",
      persecución: "Ser perseguido sugiere que estás evitando un problema o situación en tu vida que requiere tu atención urgente."
    };
    
    // Añadir interpretaciones basadas en símbolos presentes
    Object.keys(symbols).forEach(symbol => {
      if (symbolMeanings[symbol]) {
        interpretations.push(symbolMeanings[symbol]);
      }
    });
    
    // Interpretación basada en emociones
    if (emotionAnalysis.detected) {
      const emotionInsights = {
        alegría: "La alegría en tus sueños puede reflejar satisfacción con aspectos de tu vida o representar esperanzas y deseos optimistas.",
        tristeza: "La tristeza puede indicar emociones no procesadas o pérdidas que necesitan atención y reconocimiento.",
        miedo: "El miedo en los sueños a menudo señala preocupaciones o inquietudes que estás experimentando en tu vida consciente.",
        ansiedad: "La ansiedad sugiere estrés o presión que estás sintiendo, posiblemente relacionado con situaciones donde te sientes evaluado o insuficiente.",
        calma: "La sensación de calma refleja equilibrio interior y aceptación. Puede ser una señal positiva de crecimiento personal.",
        ira: "La ira en los sueños puede representar frustraciones reprimidas o injusticias que sientes pero no has podido expresar."
      };
      
      if (emotionInsights[emotionAnalysis.primaryEmotion]) {
        interpretations.push(emotionInsights[emotionAnalysis.primaryEmotion]);
      }
    }
    
    // Interpretación general si no hay suficientes elementos específicos
    if (interpretations.length < 2) {
      interpretations.push("Este sueño parece contener elementos personales significativos. Considera cómo las personas, lugares y situaciones pueden relacionarse metafóricamente con tu vida actual.");
    }
    
    return interpretations;
  };

  // Generador de recomendaciones
  const generateRecommendations = (interpretations, primaryEmotion) => {
    const generalRecommendations = [
      "Lleva un diario de sueños para descubrir patrones a lo largo del tiempo.",
      "Practica la meditación antes de dormir para mejorar la calidad y recuerdo de tus sueños.",
      "Reflexiona sobre las conexiones entre los símbolos de tus sueños y tu vida cotidiana."
    ];
    
    const emotionBasedRecommendations = {
      alegría: [
        "Identifica qué aspectos de tu sueño te produjeron alegría y busca incorporarlos en tu vida consciente.",
        "Este sueño positivo puede servir como recurso emocional en momentos difíciles."
      ],
      tristeza: [
        "Considera qué pérdidas o desilusiones podrían estar reflejadas en este sueño.",
        "Permite sentir completamente estas emociones como parte de tu proceso de curación."
      ],
      miedo: [
        "Enfrenta simbólicamente lo que te causa miedo, tal vez mediante visualización o escritura.",
        "Busca el mensaje que este miedo podría estar tratando de comunicarte."
      ],
      ansiedad: [
        "Practica técnicas de relajación y manejo del estrés antes de dormir.",
        "Identifica las fuentes de presión en tu vida y considera maneras de reducirlas."
      ],
      ira: [
        "Explora formas saludables de expresar y canalizar la ira en tu vida consciente.",
        "Considera qué límites podrías necesitar establecer o qué injusticias necesitas abordar."
      ],
      confusión: [
        "Este sueño confuso puede reflejar incertidumbre en tu vida. Tómate tiempo para aclarar tus prioridades.",
        "Fragmentos confusos pueden ser piezas desconectadas de tu experiencia que buscan integración."
      ]
    };
    
    const recommendations = [...generalRecommendations];
    
    // Añadir recomendaciones basadas en la emoción primaria
    if (primaryEmotion && emotionBasedRecommendations[primaryEmotion]) {
      recommendations.push(...emotionBasedRecommendations[primaryEmotion]);
    }
    
    // Seleccionar 3 recomendaciones aleatorias
    return recommendations
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  };

  // Analizador de tendencias emocionales
  const analyzeEmotionTrends = (dreamList) => {
    // Objeto para almacenar conteo de emociones por fecha
    const emotionsByDate = {};
    const emotionTotals = {
      alegría: 0,
      tristeza: 0,
      miedo: 0,
      ansiedad: 0,
      calma: 0,
      ira: 0,
      confusión: 0,
      sorpresa: 0
    };
    
    // Analizar cada sueño
    dreamList.forEach(dream => {
      const emotionResult = analyzeEmotions(dream.content);
      const date = dream.dream_date;
      
      // Inicializar conteo para esta fecha si es necesario
      if (!emotionsByDate[date]) {
        emotionsByDate[date] = {};
      }
      
      // Añadir emociones detectadas
      if (emotionResult.detected) {
        Object.entries(emotionResult.emotions).forEach(([emotion, percentage]) => {
          emotionsByDate[date][emotion] = (emotionsByDate[date][emotion] || 0) + percentage;
          emotionTotals[emotion] += percentage;
        });
      }
    });
    
    // Determinar emoción predominante
    let predominantEmotion = 'neutral';
    let maxTotal = 0;
    
    Object.entries(emotionTotals).forEach(([emotion, total]) => {
      if (total > maxTotal) {
        maxTotal = total;
        predominantEmotion = emotion;
      }
    });
    
    // Crear datos para gráficos
    const chartData = {
      labels: Object.keys(emotionTotals).filter(emotion => emotionTotals[emotion] > 0),
      datasets: [{
        data: Object.values(emotionTotals).filter(total => total > 0),
        backgroundColor: [
          '#FFD700', // alegría
          '#6495ED', // tristeza
          '#DC143C', // miedo
          '#FF8C00', // ansiedad
          '#20B2AA', // calma
          '#B22222', // ira
          '#9370DB', // confusión
          '#32CD32'  // sorpresa
        ]
      }]
    };
    
    return {
      predominantEmotion,
      emotionTotals,
      emotionsByDate,
      chartData
    };
  };

  // Generador de insights
  const generateInsights = (emotionTrends, symbols, patterns) => {
    const insights = [];
    
    // Insights basados en emociones predominantes
    if (emotionTrends.predominantEmotion !== 'neutral') {
      const emotionInsights = {
        alegría: "Tus sueños reflejan una tendencia hacia emociones positivas, lo que sugiere satisfacción general o optimismo en tu vida actual.",
        tristeza: "La predominancia de tristeza en tus sueños podría indicar emociones no procesadas que buscan reconocimiento y atención.",
        miedo: "El miedo recurrente en tus sueños sugiere que hay situaciones en tu vida que te generan inseguridad o aprensión.",
        ansiedad: "Los patrones de ansiedad en tus sueños podrían estar relacionados con presiones o responsabilidades en tu vida consciente.",
        calma: "La sensación de calma predominante en tus sueños puede reflejar un periodo de equilibrio y aceptación en tu vida.",
        ira: "La frecuencia de ira en tus sueños sugiere frustraciones o límites personales que podrían necesitar atención."
      };
      
      if (emotionInsights[emotionTrends.predominantEmotion]) {
        insights.push(emotionInsights[emotionTrends.predominantEmotion]);
      }
    }
    
    // Insights basados en símbolos recurrentes
    if (Object.keys(symbols).length > 0) {
      const topSymbol = Object.keys(symbols)[0]; // El símbolo más frecuente
      
      const symbolInsights = {
        agua: "La recurrencia de agua en tus sueños sugiere una conexión profunda con tus emociones y tu mundo interior.",
        fuego: "La presencia repetida de fuego en tus sueños podría reflejar una etapa de transformación o pasión intensa en tu vida.",
        casa: "Las casas aparecen frecuentemente en tus sueños, lo que puede indicar un periodo de auto-exploración o reflexión sobre tu identidad.",
        viaje: "Los viajes recurrentes en tus sueños sugieren que estás en una etapa de transición o búsqueda personal.",
        vehículos: "La frecuencia de vehículos en tus sueños podría reflejar preocupaciones sobre tu dirección en la vida o la velocidad a la que avanzan las cosas.",
        caída: "Los sueños recurrentes de caída suelen aparecer en momentos donde sientes falta de control o inseguridad en algún aspecto de tu vida.",
        vuelo: "La frecuencia de vuelo en tus sueños sugiere aspiraciones, deseos de libertad o necesidad de obtener una nueva perspectiva."
      };
      
      if (symbolInsights[topSymbol]) {
        insights.push(symbolInsights[topSymbol]);
      }
    }
    
    // Insights basados en patrones
    if (patterns.length > 0) {
      const topPattern = patterns[0]; // El patrón más frecuente
      
      insights.push(`Tus sueños muestran un patrón frecuente de ${topPattern.nombre.toLowerCase()}, lo que podría reflejar ${topPattern.descripción.toLowerCase()}.`);
    }
    
    // Insight general si no hay suficientes específicos
    if (insights.length < 2) {
      insights.push("Tu colección de sueños muestra elementos y temas personalizados. Continúa registrándolos para descubrir patrones más claros a lo largo del tiempo.");
    }
    
    return insights;
  };

  return { analysisResults, loading, error };
}
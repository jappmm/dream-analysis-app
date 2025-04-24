// src/services/dreamService.js
const dreams = [];
let nextId = 1;

// Obtener sueños (limitados a una cantidad específica)
export const getDreams = async (userId, limit = 10) => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Filtrar por usuario y ordenar por fecha (más recientes primero)
  return dreams
    .filter(dream => dream.userId === userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

// Obtener un sueño específico por ID
export const getDreamById = async (userId, dreamId) => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return dreams.find(d => d.id === dreamId && d.userId === userId) || null;
};

// Guardar un nuevo sueño
export const saveDream = async (dreamData) => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newDream = {
    ...dreamData,
    id: `dream_${nextId++}`,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  
  dreams.push(newDream);
  return newDream.id;
};

// Analizar un sueño (simulado)
export const analyzeDream = async (dreamId, dreamData) => {
  // Simular el análisis (toma más tiempo)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const dreamIndex = dreams.findIndex(d => d.id === dreamId);
  if (dreamIndex !== -1) {
    dreams[dreamIndex] = {
      ...dreams[dreamIndex],
      status: 'analyzed',
      analysis: {
        summary: "Este sueño refleja aspectos de tu subconsciente relacionados con tus experiencias recientes.",
        symbols: [
          {
            name: "Agua",
            meaning: "Representa emociones y el subconsciente",
            context: "En tu contexto, podría reflejar un estado emocional fluido o cambiante"
          },
          {
            name: "Volar",
            meaning: "Simboliza libertad, trascendencia o escape",
            context: "Puede indicar un deseo de libertad o superar obstáculos actuales"
          }
        ],
        patterns: [
          {
            description: "Elementos de transformación",
            significance: "Sugiere un período de cambio personal o transición en tu vida"
          },
          {
            description: "Entornos naturales",
            significance: "Conexión con aspectos primitivos o fundamentales de tu personalidad"
          }
        ],
        reflectionQuestions: [
          "¿Cómo se relacionan los elementos del sueño con tu vida actual?",
          "¿Qué emociones predominantes experimentaste durante el sueño?",
          "¿Reconoces algún patrón similar en sueños anteriores?"
        ],
        recommendations: [
          "Mantén un diario de sueños regular para identificar patrones",
          "Reflexiona sobre las emociones que surgieron durante el sueño",
          "Considera cómo los símbolos pueden relacionarse con situaciones actuales"
        ]
      }
    };
  }
  
  return true;
};

// Guardar feedback sobre un análisis
export const saveFeedback = async (userId, dreamId, feedback) => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const dreamIndex = dreams.findIndex(d => d.id === dreamId && d.userId === userId);
  if (dreamIndex !== -1) {
    if (!dreams[dreamIndex].feedbacks) {
      dreams[dreamIndex].feedbacks = [];
    }
    
    dreams[dreamIndex].feedbacks.push({
      ...feedback,
      id: `feedback_${Date.now()}`,
      createdAt: new Date().toISOString()
    });
  }
  
  return true;
};

// Obtener símbolos más comunes
export const getSymbols = async () => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return [
    {
      _id: "Agua",
      count: 7,
      interpretations: [
        "Representa emociones y el inconsciente colectivo",
        "Agua clara puede simbolizar claridad mental",
        "Agua turbia puede representar confusión emocional"
      ]
    },
    {
      _id: "Volar",
      count: 5,
      interpretations: [
        "Simboliza libertad y trascendencia",
        "Puede representar el deseo de escapar de limitaciones",
        "También asociado con perspectiva y visión amplia"
      ]
    },
    {
      _id: "Caída",
      count: 4,
      interpretations: [
        "Asociado con miedo al fracaso o pérdida de control",
        "Puede reflejar ansiedad o inseguridad",
        "A veces representa liberación de tensión o rendición"
      ]
    }
  ];
};

export default {
  getDreams,
  getDreamById,
  saveDream,
  analyzeDream,
  saveFeedback,
  getSymbols
};
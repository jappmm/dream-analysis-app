const axios = require('axios');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

// Cargar el prompt para el análisis de sueños
const DREAM_ANALYSIS_PROMPT = fs.readFileSync(
  path.join(__dirname, '../../ai-prompt/dreamAnalysisPrompt.md'),
  'utf8'
);

class AIService {
  constructor() {
    this.apiKey = process.env.AI_API_KEY;
    this.apiUrl = process.env.AI_API_URL;
    this.model = process.env.AI_MODEL || 'gpt-4';
    this.systemPrompt = DREAM_ANALYSIS_PROMPT;
  }

  /**
   * Analiza un sueño utilizando el modelo de IA
   * @param {Object} dreamData - Datos del sueño a analizar
   * @param {Object} userData - Datos relevantes del usuario (anónimos)
   * @returns {Promise<Object>} - Resultado del análisis
   */
  async analyzeDream(dreamData, userData) {
    try {
      logger.info(`Iniciando análisis de sueño: ${dreamData._id}`);
      
      // Preparar contexto del usuario (sin información identificable)
      const userContext = this._prepareUserContext(userData);
      
      // Preparar el historial de sueños si está disponible
      const dreamHistory = dreamData.dreamHistory || [];
      
      // Construir el mensaje para el modelo de IA
      const messages = [
        {
          role: 'system',
          content: this.systemPrompt
        },
        {
          role: 'user',
          content: this._buildAnalysisPrompt(dreamData, userContext, dreamHistory)
        }
      ];
      
      // Realizar la petición a la API
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 2000,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      
      // Procesar y estructurar la respuesta
      const analysisResult = this._processAnalysisResponse(response.data);
      
      logger.info(`Análisis de sueño completado: ${dreamData._id}`);
      return analysisResult;
      
    } catch (error) {
      logger.error(`Error en análisis de sueño: ${error.message}`);
      
      // Si hay un error con la API, devolver un análisis básico
      if (error.response) {
        logger.error(`Error de API: ${JSON.stringify(error.response.data)}`);
      }
      
      return this._createFallbackAnalysis(dreamData);
    }
  }
  
  /**
   * Prepara el contexto del usuario para el análisis
   * @param {Object} userData - Datos del usuario
   * @returns {Object} - Contexto anónimo del usuario
   */
  _prepareUserContext(userData) {
    // Solo incluir información demográfica y preferencias, nada identificable
    return {
      demographics: userData.demographics || {},
      preferences: userData.preferences || {},
      dreamCount: userData.dreamCount || 0,
      memberSince: userData.createdAt ? new Date(userData.createdAt).toISOString().split('T')[0] : null
    };
  }
  
  /**
   * Construye el prompt específico para el análisis
   * @param {Object} dreamData - Datos del sueño
   * @param {Object} userContext - Contexto del usuario
   * @param {Array} dreamHistory - Historial de sueños previo
   * @returns {String} - Prompt para el análisis
   */
  _buildAnalysisPrompt(dreamData, userContext, dreamHistory) {
    return `
# Solicitud de Análisis de Sueño

## Datos del Sueño
- **Título**: ${dreamData.title}
- **Fecha**: ${new Date(dreamData.dreamDate).toISOString().split('T')[0]}
- **Descripción**: ${dreamData.content}
- **Emociones**: ${dreamData.emotions ? dreamData.emotions.map(e => `${e.name} (Intensidad: ${e.intensity})`).join(', ') : 'No especificadas'}
- **Personajes**: ${dreamData.characters ? dreamData.characters.map(c => `${c.name} (${c.relation})`).join(', ') : 'Ninguno mencionado'}
- **Escenarios**: ${dreamData.settings ? dreamData.settings.join(', ') : 'No especificados'}
- **Nivel de Lucidez**: ${dreamData.lucidity}/5
- **Calidad del Sueño**: ${dreamData.sleepQuality}/10
- **Etiquetas**: ${dreamData.tags ? dreamData.tags.join(', ') : 'Ninguna'}
- **Recurrente**: ${dreamData.isRecurring ? 'Sí' : 'No'}
- **Pesadilla**: ${dreamData.isNightmare ? 'Sí' : 'No'}
- **Situación de Vida**: ${dreamData.lifeSituation || 'No especificada'}

## Contexto del Usuario
- **Edad**: ${userContext.demographics?.age || 'No especificada'}
- **Género**: ${userContext.demographics?.gender || 'No especificado'}
- **Ocupación**: ${userContext.demographics?.occupation || 'No especificada'}
- **Sueños Registrados**: ${userContext.dreamCount || 0}
- **Usuario desde**: ${userContext.memberSince || 'Fecha no disponible'}

## Historial de Sueños Recientes
${this._formatDreamHistory(dreamHistory)}

Por favor, analiza este sueño considerando el contexto proporcionado. Necesito:
1. Una interpretación general del sueño
2. Análisis de los símbolos principales
3. Análisis emocional y patrones identificados
4. Posibles conexiones con la vida real
5. Preguntas reflexivas para el usuario
6. Recomendaciones basadas en el contenido del sueño

Si identificas elementos que podrían requerir atención profesional, por favor indícalo claramente.`;
  }
  
  /**
   * Formatea el historial de sueños para incluirlo en el prompt
   * @param {Array} dreamHistory - Historial de sueños
   * @returns {String} - Texto formateado del historial
   */
  _formatDreamHistory(dreamHistory) {
    if (!dreamHistory || dreamHistory.length === 0) {
      return "No hay sueños previos registrados.";
    }
    
    // Limitar a los 3 sueños más recientes para no sobrecargar el contexto
    const recentDreams = dreamHistory.slice(0, 3);
    
    return recentDreams.map(dream => `
- **${new Date(dream.dreamDate).toISOString().split('T')[0]} - ${dream.title}**: 
  ${dream.content.substring(0, 100)}${dream.content.length > 100 ? '...' : ''}
  Emociones principales: ${dream.emotions ? dream.emotions.map(e => e.name).join(', ') : 'No especificadas'}
  Temas: ${dream.tags ? dream.tags.join(', ') : 'Ninguno'}
    `).join('\n');
  }
  
  /**
   * Procesa la respuesta de la API y la estructura en formato útil
   * @param {Object} responseData - Respuesta de la API
   * @returns {Object} - Análisis estructurado
   */
  _processAnalysisResponse(responseData) {
    try {
      const content = responseData.choices[0].message.content;
      
      // Extraer secciones del análisis usando expresiones regulares
      // Este es un ejemplo básico, se puede mejorar con NLP o JSON estructurado
      const generalInterpretation = this._extractSection(content, 'interpretación general', 'análisis de símbolos');
      const symbolAnalysis = this._parseSymbolAnalysis(content);
      const emotionalAnalysis = this._extractEmotionalAnalysis(content);
      const realLifeConnections = this._extractSection(content, 'conexiones con la vida real', 'preguntas reflexivas');
      const reflectiveQuestions = this._extractQuestions(content);
      const recommendations = this._extractRecommendations(content);
      const professionalAttentionFlags = this._extractProfessionalAttentionFlags(content);
      
      // Estructurar el resultado de análisis
      return {
        generalInterpretation,
        symbolAnalysis,
        emotionalAnalysis,
        patternIdentification: {
          recurringThemes: this._extractThemes(content),
          connectionToPreviousDreams: this._extractSection(content, 'conexiones con sueños anteriores', 'conexiones con la vida real'),
          personalPatterns: []
        },
        psychologicalPerspectives: this._extractPerspectives(content),
        realLifeConnections: {
          potentialInfluences: this._extractInfluences(content),
          suggestedReflections: [],
          lifeAreaImpacts: this._extractLifeAreas(content)
        },
        reflectiveQuestions,
        recommendations: {
          journalingPrompts: recommendations.journaling || [],
          mindfulnessExercises: recommendations.mindfulness || [],
          creativeExplorations: recommendations.creative || [],
          practicalActions: recommendations.practical || []
        },
        professionalAttentionFlags,
        analysisMetadata: {
          aiModel: responseData.model,
          confidenceScore: 0.85, // Valor ficticio, idealmente se calcularía
          analysisVersion: '1.0',
          processingTime: responseData.usage.completion_tokens / 20, // Estimación en segundos
          followUpRecommended: false
        }
      };
    } catch (error) {
      logger.error(`Error procesando respuesta de análisis: ${error.message}`);
      return this._createFallbackAnalysis();
    }
  }
  
  /**
   * Extrae una sección específica del texto de respuesta
   */
  _extractSection(text, sectionStart, sectionEnd) {
    try {
      const startRegex = new RegExp(`(?:^|\\n)(?:\\d+\\.?\\s*)?(?:\\*\\*)?${sectionStart}(?:\\*\\*)?(?:\\s*:)?`, 'i');
      const endRegex = new RegExp(`(?:^|\\n)(?:\\d+\\.?\\s*)?(?:\\*\\*)?${sectionEnd}(?:\\*\\*)?(?:\\s*:)?`, 'i');
      
      const startMatch = text.search(startRegex);
      if (startMatch === -1) return '';
      
      let content = text.substring(startMatch);
      const endMatch = content.search(endRegex);
      
      if (endMatch !== -1) {
        content = content.substring(0, endMatch);
      }
      
      // Limpiar marcadores de sección y formateo
      return content.replace(startRegex, '').trim();
    } catch (error) {
      logger.error(`Error extrayendo sección ${sectionStart}: ${error.message}`);
      return '';
    }
  }
  
  // Los siguientes métodos analizarían el texto para extraer información específica
  // Son simplificaciones para este ejemplo
  
  _parseSymbolAnalysis(text) {
    // Implementación simplificada
    const symbolSection = this._extractSection(text, 'análisis de símbolos', 'análisis emocional');
    const symbols = symbolSection.split(/\n\s*[-•]\s*/).filter(Boolean);
    
    return symbols.map(symbolText => {
      const nameMatch = symbolText.match(/^([^:]+):/);
      const name = nameMatch ? nameMatch[1].trim() : 'Símbolo no identificado';
      const interpretation = symbolText.replace(/^[^:]+:/, '').trim();
      
      return {
        symbol: name,
        interpretation,
        psychologicalContext: '',
        culturalReferences: []
      };
    });
  }
  
  _extractEmotionalAnalysis(text) {
    const emotionalSection = this._extractSection(text, 'análisis emocional', 'patrones identificados');
    
    // Extraer emoción primaria
    const primaryEmotionMatch = emotionalSection.match(/emoción(?:\es)? principal(?:\es)?[^\w]+([\w\s]+)/i);
    const primaryEmotion = primaryEmotionMatch ? primaryEmotionMatch[1].trim() : '';
    
    // Extraer temas emocionales
    const themesMatch = emotionalSection.match(/temas emocionales[^\w]+([\w\s,]+)/i);
    const themes = themesMatch 
      ? themesMatch[1].split(/,|\sy\s/).map(t => t.trim()).filter(Boolean)
      : [];
    
    return {
      primaryEmotion,
      emotionalThemes: themes,
      emotionalPatterns: emotionalSection,
      subconscientExpressions: ''
    };
  }
  
  _extractQuestions(text) {
    const questionsSection = this._extractSection(text, 'preguntas reflexivas', 'recomendaciones');
    
    // Extraer preguntas usando marcadores de lista o signos de interrogación
    const questions = [];
    const questionMatches = questionsSection.match(/(?:^|\n)\s*(?:[-•]\s*|\d+\.\s*)?([^,.]+\?)/gm);
    
    if (questionMatches) {
      return questionMatches.map(q => q.replace(/^\s*(?:[-•]\s*|\d+\.\s*)?/, '').trim());
    }
    
    return questions;
  }
  
  _extractRecommendations(text) {
    const recommendationsSection = this._extractSection(text, 'recomendaciones', 'atención profesional');
    
    // Categorías predefinidas para las recomendaciones
    const categories = {
      journaling: [],
      mindfulness: [],
      creative: [],
      practical: []
    };
    
    // Procesar recomendaciones y categorizarlas
    const recommendations = recommendationsSection.split(/\n\s*[-•]\s*/).filter(Boolean);
    
    recommendations.forEach(rec => {
      if (/escri(?:bir|tura)|diario|journa/i.test(rec)) {
        categories.journaling.push(rec.trim());
      } else if (/meditaci[oó]n|mindful|conscien|respira/i.test(rec)) {
        categories.mindfulness.push(rec.trim());
      } else if (/arte|dibuj|pint|crea(?:tiv|r)|expres/i.test(rec)) {
        categories.creative.push(rec.trim());
      } else {
        categories.practical.push(rec.trim());
      }
    });
    
    return categories;
  }
  
  _extractProfessionalAttentionFlags(text) {
    const attentionSection = this._extractSection(text, 'atención profesional', 'conclusión');
    
    // Verificar si hay banderas de atención
    const hasFlags = /(?:recomendar|consultar|buscar|considerar)[^,.]+(?:profesional|terapeuta|especialista)/i.test(attentionSection);
    
    // Extraer razones
    const flagReasons = [];
    if (hasFlags) {
      const reasonMatches = attentionSection.match(/(?:^|\n)\s*(?:[-•]\s*|\d+\.\s*)([^,.]+)/gm);
      if (reasonMatches) {
        reasonMatches.forEach(reason => {
          flagReasons.push(reason.replace(/^\s*(?:[-•]\s*|\d+\.\s*)?/, '').trim());
        });
      }
    }
    
    // Determinar nivel de sugerencia
    let suggestionLevel = 'informativo';
    if (hasFlags) {
      if (/urgent|importante|significativ|preocupante/i.test(attentionSection)) {
        suggestionLevel = 'importante';
      } else {
        suggestionLevel = 'recomendado';
      }
    }
    
    return {
      hasFlags,
      flagReasons,
      suggestionLevel
    };
  }
  
  _extractThemes(text) {
    const patternsSection = this._extractSection(text, 'patrones identificados', 'perspectivas psicológicas');
    
    // Extraer temas recurrentes
    const themesMatch = patternsSection.match(/temas recurrentes[^\w]+([\w\s,]+)/i);
    
    if (themesMatch) {
      return themesMatch[1].split(/,|\sy\s/).map(t => t.trim()).filter(Boolean);
    }
    
    return [];
  }
  
  _extractPerspectives(text) {
    const perspectivesSection = this._extractSection(text, 'perspectivas psicológicas', 'conexiones');
    
    // Marcos teóricos comunes
    const frameworks = [
      { name: 'jungiano', regex: /jung/i },
      { name: 'freudiano', regex: /freud/i },
      { name: 'gestalt', regex: /gestalt/i },
      { name: 'cognitivo', regex: /cognitiv/i },
      { name: 'neurociencia', regex: /neuro|cerebr/i }
    ];
    
    const perspectives = [];
    
    frameworks.forEach(framework => {
      const match = perspectivesSection.match(new RegExp(`${framework.regex.source}[^.,]*(?:[.,][^.,]*){0,3}`, 'i'));
      if (match) {
        perspectives.push({
          framework: framework.name,
          interpretation: match[0].trim()
        });
      }
    });
    
    // Agregar una perspectiva adicional si no se encontró ninguna
    if (perspectives.length === 0 && perspectivesSection.trim()) {
      perspectives.push({
        framework: 'otro',
        interpretation: perspectivesSection.trim()
      });
    }
    
    return perspectives;
  }
  
  _extractInfluences(text) {
    const connectionsSection = this._extractSection(text, 'conexiones con la vida real', 'preguntas');
    
    // Extraer posibles influencias
    const influences = [];
    const influenceMatches = connectionsSection.match(/(?:^|\n)\s*(?:[-•]\s*|\d+\.\s*)([^.!?]+[.!?])/gm);
    
    if (influenceMatches) {
      return influenceMatches.map(i => i.replace(/^\s*(?:[-•]\s*|\d+\.\s*)?/, '').trim());
    }
    
    return influences;
  }
  
  _extractLifeAreas(text) {
    const connectionsSection = this._extractSection(text, 'conexiones con la vida real', 'preguntas');
    
    // Áreas de vida comunes
    const lifeAreas = [
      { area: 'personal', regex: /personal|individu|autodescubrimiento|identidad/i },
      { area: 'relaciones', regex: /relacion|familia|amist|pareja|social/i },
      { area: 'profesional', regex: /(?:pro)?fesional|trabajo|carrera|estudios|laboral/i },
      { area: 'salud', regex: /salud|bienestar|físic|mental|emocional/i },
      { area: 'espiritual', regex: /espiritual|religios|fé|creencias/i },
      { area: 'creativo', regex: /creativ|artístic|expresi[óo]n/i }
    ];
    
    const impacts = [];
    
    lifeAreas.forEach(area => {
      const match = connectionsSection.match(new RegExp(`${area.regex.source}[^.,]*(?:[.,][^.,]*){0,3}`, 'i'));
      if (match) {
        impacts.push({
          area: area.area,
          description: match[0].trim()
        });
      }
    });
    
    return impacts;
  }
  
  /**
   * Crea un análisis básico en caso de error
   * @returns {Object} - Análisis básico de respaldo
   */
  _createFallbackAnalysis(dreamData = {}) {
    return {
      generalInterpretation: "No se pudo generar un análisis completo. Los sueños son experiencias personales complejas que pueden reflejar nuestras preocupaciones, deseos y emociones subconscientes.",
      symbolAnalysis: [],
      emotionalAnalysis: {
        primaryEmotion: "",
        emotionalThemes: [],
        emotionalPatterns: "",
        subconscientExpressions: ""
      },
      patternIdentification: {
        recurringThemes: [],
        connectionToPreviousDreams: "",
        personalPatterns: []
      },
      psychologicalPerspectives: [
        {
          framework: "cognitivo",
          interpretation: "Los sueños pueden ayudarnos a procesar información y emociones del día a día."
        }
      ],
      realLifeConnections: {
        potentialInfluences: ["Experiencias recientes", "Preocupaciones actuales"],
        suggestedReflections: [],
        lifeAreaImpacts: []
      },
      reflectiveQuestions: [
        "¿Qué emociones destacaron en tu sueño?",
        "¿Puedes identificar elementos de tu vida diaria reflejados en el sueño?",
        "¿Hay algo en el sueño que te resulte particularmente significativo?"
      ],
      recommendations: {
        journalingPrompts: ["Escribe más detalles sobre tu sueño mientras los recuerdas"],
        mindfulnessExercises: [],
        creativeExplorations: [],
        practicalActions: []
      },
      professionalAttentionFlags: {
        hasFlags: false,
        flagReasons: [],
        suggestionLevel: "informativo"
      },
      analysisMetadata: {
        aiModel: "fallback",
        confidenceScore: 0.5,
        analysisVersion: "1.0",
        processingTime: 0,
        followUpRecommended: false
      }
    };
  }
}

module.exports = new AIService();
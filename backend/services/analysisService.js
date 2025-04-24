const Dream = require('../api/models/Dream');
const Analysis = require('../api/models/Analysis');
const aiService = require('./aiService');
const logger = require('../utils/logger');

/**
 * Servicio para gestionar los análisis de sueños
 */
class AnalysisService {
  /**
   * Genera un nuevo análisis para un sueño
   * @param {string} dreamId - ID del sueño a analizar
   * @param {string} userId - ID del usuario propietario del sueño
   * @returns {Promise<Object>} El análisis generado
   */
  async generateAnalysis(dreamId, userId) {
    try {
      // Verificar si ya existe un análisis para este sueño
      const existingAnalysis = await Analysis.findOne({ dream: dreamId });
      
      if (existingAnalysis) {
        logger.info(`Análisis ya existente para sueño ${dreamId}, devolviendo existente`);
        return existingAnalysis;
      }
      
      // Obtener el sueño completo con sus datos
      const dream = await Dream.findById(dreamId);
      
      if (!dream) {
        throw new Error('Sueño no encontrado');
      }
      
      // Verificar permisos
      if (dream.user.toString() !== userId) {
        throw new Error('No autorizado para generar análisis de este sueño');
      }
      
      // Obtener historial reciente de sueños del usuario para contexto
      const dreamHistory = await Dream.find({ 
        user: userId,
        _id: { $ne: dreamId }
      })
        .sort({ dreamDate: -1 })
        .limit(5)
        .select('title content dreamDate emotions tags');
      
      // Preparar datos para el análisis
      const dreamData = dream.toObject();
      dreamData.dreamHistory = dreamHistory;
      
      // Generar análisis con IA
      const analysisResult = await aiService.analyzeDream(dreamData);
      
      // Crear objeto de análisis
      const analysis = new Analysis({
        dream: dreamId,
        user: userId,
        ...analysisResult
      });
      
      // Guardar en base de datos
      await analysis.save();
      
      logger.info(`Análisis generado y guardado exitosamente para sueño ${dreamId}`);
      return analysis;
    } catch (error) {
      logger.error(`Error al generar análisis: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Regenera un análisis existente
   * @param {string} dreamId - ID del sueño
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} El nuevo análisis generado
   */
  async regenerateAnalysis(dreamId, userId) {
    try {
      // Eliminar análisis existente
      await Analysis.deleteOne({ dream: dreamId });
      
      // Generar nuevo análisis
      return this.generateAnalysis(dreamId, userId);
    } catch (error) {
      logger.error(`Error al regenerar análisis: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Obtiene análisis por ID de sueño
   * @param {string} dreamId - ID del sueño
   * @param {string} userId - ID del usuario
   * @returns {Promise<Object>} El análisis encontrado
   */
  async getAnalysisByDreamId(dreamId, userId) {
    try {
      const analysis = await Analysis.findOne({ dream: dreamId });
      
      if (!analysis) {
        throw new Error('Análisis no encontrado');
      }
      
      // Verificar permisos
      if (analysis.user.toString() !== userId && req.user.role !== 'administrador') {
        throw new Error('No autorizado para acceder a este análisis');
      }
      
      return analysis;
    } catch (error) {
      logger.error(`Error al obtener análisis: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Obtiene todos los análisis de un usuario
   * @param {string} userId - ID del usuario
   * @param {Object} filters - Filtros a aplicar
   * @param {Object} pagination - Opciones de paginación
   * @returns {Promise<Object>} Lista de análisis y metadatos de paginación
   */
  async getUserAnalyses(userId, filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;
      
      // Construir consulta base
      const query = { user: userId };
      
      // Aplicar filtros
      if (filters.emotion) {
        query['emotionalAnalysis.primaryEmotion'] = new RegExp(filters.emotion, 'i');
      }
      
      if (filters.symbol) {
        query['symbolAnalysis.symbol'] = new RegExp(filters.symbol, 'i');
      }
      
      if (filters.theme) {
        query['patternIdentification.recurringThemes'] = new RegExp(filters.theme, 'i');
      }
      
      // Ejecutar consulta
      const analyses = await Analysis.find(query)
        .populate('dream', 'title content dreamDate tags')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      
      // Obtener total para paginación
      const total = await Analysis.countDocuments(query);
      
      return {
        data: analyses,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit
        }
      };
    } catch (error) {
      logger.error(`Error al obtener análisis de usuario: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Genera insights consolidados basados en todos los análisis del usuario
   * @param {string} userId - ID del usuario
   * @param {number} months - Número de meses a considerar
   * @returns {Promise<Object>} Insights generados
   */
  async generateInsights(userId, months = 1) {
    try {
      // Calcular rango de fechas
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      
      // Buscar análisis en el período especificado
      const analyses = await Analysis.find({
        user: userId,
        createdAt: { $gte: startDate, $lte: endDate }
      }).populate('dream', 'dreamDate tags emotions');
      
      if (analyses.length === 0) {
        return {
          recurringThemes: [],
          emotionalPatterns: [],
          symbolPatterns: [],
          timeBasedPatterns: [],
          recommendations: []
        };
      }
      
      // Extraer temas recurrentes
      const allThemes = [];
      analyses.forEach(analysis => {
        if (analysis.patternIdentification && analysis.patternIdentification.recurringThemes) {
          allThemes.push(...analysis.patternIdentification.recurringThemes);
        }
      });
      
      const recurringThemes = this._countOccurrences(allThemes);
      
      // Extraer patrones emocionales
      const emotions = [];
      analyses.forEach(analysis => {
        if (analysis.emotionalAnalysis && analysis.emotionalAnalysis.primaryEmotion) {
          emotions.push(analysis.emotionalAnalysis.primaryEmotion);
        }
        
        if (analysis.emotionalAnalysis && analysis.emotionalAnalysis.emotionalThemes) {
          emotions.push(...analysis.emotionalAnalysis.emotionalThemes);
        }
      });
      
      const emotionalPatterns = this._countOccurrences(emotions);
      
      // Extraer patrones de símbolos
      const symbols = [];
      analyses.forEach(analysis => {
        if (analysis.symbolAnalysis) {
          symbols.push(...analysis.symbolAnalysis.map(s => s.symbol));
        }
      });
      
      const symbolPatterns = this._countOccurrences(symbols);
      
      // Analizar patrones temporales
      const timeBasedPatterns = this._analyzeTimePatterns(analyses);
      
      // Generar recomendaciones
      const recommendations = this._generateRecommendations(recurringThemes, emotionalPatterns, symbolPatterns);
      
      return {
        recurringThemes,
        emotionalPatterns,
        symbolPatterns,
        timeBasedPatterns,
        recommendations
      };
    } catch (error) {
      logger.error(`Error al generar insights: ${error.message}`);
      throw error;
    }
  }
  
  // Método auxiliar para contar ocurrencias
  _countOccurrences(array) {
    const counts = {};
    
    array.forEach(item => {
      if (item && typeof item === 'string') {
        const normalizedItem = item.trim().toLowerCase();
        if (normalizedItem) {
          counts[normalizedItem] = (counts[normalizedItem] || 0) + 1;
        }
      }
    });
    
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }
  
  // Método auxiliar para analizar patrones temporales
  _analyzeTimePatterns(analyses) {
    // Agrupar por día de la semana
    const dayOfWeekCounts = [0, 0, 0, 0, 0, 0, 0]; // Domingo a Sábado
    
    analyses.forEach(analysis => {
      if (analysis.dream && analysis.dream.dreamDate) {
        const date = new Date(analysis.dream.dreamDate);
        const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado
        dayOfWeekCounts[dayOfWeek]++;
      }
    });
    
    // Encontrar el día con más sueños
    let maxDay = 0;
    let maxCount = dayOfWeekCounts[0];
    
    for (let i = 1; i < 7; i++) {
      if (dayOfWeekCounts[i] > maxCount) {
        maxDay = i;
        maxCount = dayOfWeekCounts[i];
      }
    }
    
    // Convertir índice a nombre de día
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const mostCommonDay = dayNames[maxDay];
    
    return {
      dayOfWeekDistribution: dayOfWeekCounts.map((count, index) => ({
        day: dayNames[index],
        count
      })),
      mostCommonDay,
      monthlyPatterns: []
    };
  }
  
  // Método auxiliar para generar recomendaciones
  _generateRecommendations(themes, emotions, symbols) {
    const recommendations = [];
    
    // Recomendaciones basadas en temas recurrentes
    if (themes.length > 0) {
      const topThemes = themes.slice(0, 3).map(t => t.name);
      
      if (topThemes.some(theme => 
        ['ansiedad', 'miedo', 'estrés', 'preocupación', 'tensión'].includes(theme)
      )) {
        recommendations.push(
          'Considera incorporar técnicas de reducción de estrés como meditación o respiración profunda en tu rutina diaria.'
        );
      }
      
      if (topThemes.some(theme => 
        ['confusión', 'indecisión', 'encrucijada', 'camino', 'dirección'].includes(theme)
      )) {
        recommendations.push(
          'Tus sueños indican que podrías estar enfrentando decisiones importantes. Considera dedicar tiempo a clarificar tus valores y prioridades.'
        );
      }
      
      recommendations.push(
        `Explora más a fondo los temas de ${topThemes.join(', ')} que aparecen frecuentemente en tus sueños mediante journaling o terapia.`
      );
    }
    
    // Recomendaciones basadas en emociones predominantes
    if (emotions.length > 0) {
      const topEmotions = emotions.slice(0, 2).map(e => e.name);
      
      if (topEmotions.some(emotion => 
        ['tristeza', 'melancolía', 'depresión', 'soledad'].includes(emotion)
      )) {
        recommendations.push(
          'Tus sueños reflejan emociones de tristeza. Considera aumentar actividades que te brinden alegría y conexión social.'
        );
      }
      
      if (topEmotions.some(emotion => 
        ['alegría', 'felicidad', 'entusiasmo', 'amor'].includes(emotion)
      )) {
        recommendations.push(
          'Tus sueños muestran emociones positivas. Identifica qué aspectos de tu vida están generando estas emociones y fortalécelos.'
        );
      }
    }
    
    // Recomendaciones generales si no hay suficientes patrones
    if (recommendations.length < 2) {
      recommendations.push(
        'Continúa registrando tus sueños regularmente para identificar patrones más claros con el tiempo.'
      );
      
      recommendations.push(
        'Considera establecer una rutina de sueño consistente para mejorar la calidad y recordación de tus sueños.'
      );
    }
    
    return recommendations;
  }
}

module.exports = new AnalysisService();
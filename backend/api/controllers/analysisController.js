const Analysis = require('../models/Analysis');
const Dream = require('../models/Dream');
const User = require('../models/User');
const aiService = require('../../services/aiService');
const logger = require('../../utils/logger');

// @desc    Obtener análisis de un sueño específico
// @route   GET /api/analysis/:dreamId
// @access  Privado
exports.getAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ dream: req.params.dreamId });
    
    // Verificar si el análisis existe
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Análisis no encontrado'
      });
    }
    
    // Verificar propiedad del análisis
    if (analysis.user.toString() !== req.user.id && req.user.role !== 'administrador') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para acceder a este análisis'
      });
    }
    
    res.status(200).json({
      success: true,
      data: analysis
    });
  } catch (error) {
    logger.error(`Error al obtener análisis: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudo recuperar el análisis',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Regenerar análisis de un sueño
// @route   POST /api/analysis/:dreamId/regenerate
// @access  Privado
exports.regenerateAnalysis = async (req, res) => {
  try {
    // Buscar el sueño
    const dream = await Dream.findById(req.params.dreamId);
    
    // Verificar si el sueño existe
    if (!dream) {
      return res.status(404).json({
        success: false,
        message: 'Sueño no encontrado'
      });
    }
    
    // Verificar propiedad del sueño
    if (dream.user.toString() !== req.user.id && req.user.role !== 'administrador') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para regenerar este análisis'
      });
    }
    
    // Eliminar análisis existente si lo hay
    await Analysis.deleteOne({ dream: req.params.dreamId });
    
    // Obtener información relevante del usuario (sin datos personales)
    const user = await User.findById(req.user.id, 'demographics preferences createdAt');
    
    // Obtener historial reciente de sueños (para contexto)
    const dreamHistory = await Dream.find({ 
      user: req.user.id,
      _id: { $ne: dream._id }
    })
      .sort({ dreamDate: -1 })
      .limit(5)
      .select('title content dreamDate emotions tags');
    
    // Obtener conteo total de sueños
    const dreamCount = await Dream.countDocuments({ user: req.user.id });
    
    // Preparar datos para el análisis
    const dreamData = dream.toObject();
    dreamData.dreamHistory = dreamHistory;
    
    const userData = user.toObject();
    userData.dreamCount = dreamCount;
    
    // Generar nuevo análisis con IA
    const analysisResult = await aiService.analyzeDream(dreamData, userData);
    
    // Guardar nuevo análisis
    const analysis = new Analysis({
      dream: dream._id,
      user: req.user.id,
      ...analysisResult
    });
    
    await analysis.save();
    
    res.status(200).json({
      success: true,
      data: analysis,
      message: 'Análisis regenerado exitosamente'
    });
  } catch (error) {
    logger.error(`Error al regenerar análisis: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudo regenerar el análisis',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obtener todos los análisis del usuario
// @route   GET /api/analysis
// @access  Privado
exports.getMyAnalyses = async (req, res) => {
  try {
    // Opciones de paginación
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Construir consulta
    const query = { user: req.user.id };
    
    // Filtros
    if (req.query.emotion) {
      query['emotionalAnalysis.primaryEmotion'] = new RegExp(req.query.emotion, 'i');
    }
    
    if (req.query.symbol) {
      query['symbolAnalysis.symbol'] = new RegExp(req.query.symbol, 'i');
    }
    
    if (req.query.theme) {
      query['patternIdentification.recurringThemes'] = new RegExp(req.query.theme, 'i');
    }
    
    // Ejecutar consulta
    const analyses = await Analysis.find(query)
      .populate('dream', 'title content dreamDate tags')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    // Obtener total para paginación
    const total = await Analysis.countDocuments(query);
    
    // Construir metadata de paginación
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit
    };
    
    res.status(200).json({
      success: true,
      count: analyses.length,
      pagination,
      data: analyses
    });
  } catch (error) {
    logger.error(`Error al obtener análisis: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudieron recuperar los análisis',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obtener insights consolidados de todos los análisis
// @route   GET /api/analysis/insights
// @access  Privado
exports.getInsights = async (req, res) => {
  try {
    // Período de tiempo (por defecto último mes)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (parseInt(req.query.months) || 1));
    
    // Buscar análisis en el período especificado
    const analyses = await Analysis.find({
      user: req.user.id,
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('dream', 'dreamDate tags emotions');
    
    if (analyses.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No hay suficientes datos para generar insights',
        data: {
          recurringThemes: [],
          emotionalPatterns: [],
          symbolPatterns: [],
          timeBasedPatterns: [],
          recommendations: []
        }
      });
    }
    
    // Extraer temas recurrentes
    const allThemes = [];
    analyses.forEach(analysis => {
      if (analysis.patternIdentification && analysis.patternIdentification.recurringThemes) {
        allThemes.push(...analysis.patternIdentification.recurringThemes);
      }
    });
    
    const recurringThemes = countOccurrences(allThemes);
    
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
    
    const emotionalPatterns = countOccurrences(emotions);
    
    // Extraer patrones de símbolos
    const symbols = [];
    analyses.forEach(analysis => {
      if (analysis.symbolAnalysis) {
        symbols.push(...analysis.symbolAnalysis.map(s => s.symbol));
      }
    });
    
    const symbolPatterns = countOccurrences(symbols);
    
    // Analizar patrones temporales
    const timeBasedPatterns = analyzeTimePatterns(analyses);
    
    // Generar recomendaciones basadas en los insights
    const recommendations = generateRecommendations(recurringThemes, emotionalPatterns, symbolPatterns);
    
    res.status(200).json({
      success: true,
      data: {
        recurringThemes: recurringThemes.slice(0, 10),
        emotionalPatterns: emotionalPatterns.slice(0, 10),
        symbolPatterns: symbolPatterns.slice(0, 10),
        timeBasedPatterns,
        recommendations
      }
    });
  } catch (error) {
    logger.error(`Error al obtener insights: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudieron generar los insights',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Función para contar ocurrencias
const countOccurrences = (array) => {
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
};

// Función para analizar patrones temporales
const analyzeTimePatterns = (analyses) => {
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
  
  // Analizar patrones mensuales (si hay suficientes datos)
  const monthlyPatterns = [];
  if (analyses.length >= 10) {
    // Implementar análisis mensual si hay suficientes datos
  }
  
  return {
    dayOfWeekDistribution: dayOfWeekCounts.map((count, index) => ({
      day: dayNames[index],
      count
    })),
    mostCommonDay,
    monthlyPatterns
  };
};

// Función para generar recomendaciones basadas en insights
const generateRecommendations = (themes, emotions, symbols) => {
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
  
  // Recomendaciones basadas en símbolos recurrentes
  if (symbols.length > 0) {
    const topSymbols = symbols.slice(0, 2).map(s => s.name);
    
    recommendations.push(
      `Presta atención a los símbolos recurrentes en tus sueños como ${topSymbols.join(', ')}. Explora su significado personal mediante técnicas creativas como dibujar o escribir sobre ellos.`
    );
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
};

module.exports = exports;
const Dream = require('../models/Dream');
const Analysis = require('../models/Analysis');
const User = require('../models/User');
const aiService = require('../../services/aiService');
const logger = require('../../utils/logger');
const mongoose = require('mongoose');

// @desc    Crear un nuevo sueño
// @route   POST /api/dreams
// @access  Privado
exports.createDream = async (req, res) => {
  try {
    const { title, content, dreamDate, emotions, symbols, settings, characters, 
            lucidity, tags, isRecurring, isNightmare, sleepQuality, lifeSituation } = req.body;
    
    // Validar campos requeridos
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Por favor proporcione un título y descripción para el sueño' });
    }
    
    // Crear objeto de sueño
    const dream = await Dream.create({
      user: req.user.id,
      title,
      content,
      dreamDate: dreamDate || Date.now(),
      emotions: emotions || [],
      symbols: symbols || [],
      settings: settings || [],
      characters: characters || [],
      lucidity: lucidity || 0,
      tags: tags || [],
      isRecurring: isRecurring || false,
      isNightmare: isNightmare || false,
      sleepQuality: sleepQuality || null,
      lifeSituation: lifeSituation || '',
      isPrivate: true,
      isAnonymizedForResearch: req.user.preferences?.dataSharing || false
    });
    
    // Si se creó el sueño exitosamente, generar análisis inicial
    if (dream._id) {
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
      
      // Generar análisis con IA (asíncrono)
      generateAnalysis(dreamData, userData, req.user.id);
      
      // Responder al cliente sin esperar el análisis completo
      return res.status(201).json({
        success: true,
        data: dream,
        message: 'Sueño registrado exitosamente. El análisis estará disponible en breve.'
      });
    }
    
    res.status(201).json({
      success: true,
      data: dream
    });
  } catch (error) {
    logger.error(`Error al crear sueño: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudo registrar el sueño',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Función para generar análisis en segundo plano
const generateAnalysis = async (dreamData, userData, userId) => {
  try {
    // Verificar si ya existe un análisis para este sueño
    const existingAnalysis = await Analysis.findOne({ dream: dreamData._id });
    
    if (existingAnalysis) {
      logger.info(`Análisis ya existente para sueño ${dreamData._id}, omitiendo generación`);
      return;
    }
    
    // Generar análisis con IA
    logger.info(`Iniciando generación de análisis para sueño ${dreamData._id}`);
    const analysisResult = await aiService.analyzeDream(dreamData, userData);
    
    // Guardar análisis en base de datos
    const analysis = new Analysis({
      dream: dreamData._id,
      user: userId,
      ...analysisResult
    });
    
    await analysis.save();
    logger.info(`Análisis guardado exitosamente para sueño ${dreamData._id}`);
  } catch (error) {
    logger.error(`Error al generar análisis para sueño ${dreamData._id}: ${error.message}`);
  }
};

// @desc    Obtener todos los sueños del usuario
// @route   GET /api/dreams
// @access  Privado
exports.getDreams = async (req, res) => {
  try {
    // Opciones de paginación
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Construir consulta base
    let query = { user: req.user.id };
    
    // Filtros
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    if (req.query.fromDate && req.query.toDate) {
      query.dreamDate = {
        $gte: new Date(req.query.fromDate),
        $lte: new Date(req.query.toDate)
      };
    } else if (req.query.fromDate) {
      query.dreamDate = { $gte: new Date(req.query.fromDate) };
    } else if (req.query.toDate) {
      query.dreamDate = { $lte: new Date(req.query.toDate) };
    }
    
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      query.tags = { $in: tags };
    }
    
    if (req.query.emotion) {
      query['emotions.name'] = req.query.emotion;
    }
    
    if (req.query.isRecurring) {
      query.isRecurring = req.query.isRecurring === 'true';
    }
    
    if (req.query.isNightmare) {
      query.isNightmare = req.query.isNightmare === 'true';
    }
    
    // Construir ordenamiento
    const sortBy = req.query.sortBy || 'dreamDate';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortBy]: sortOrder };
    
    // Ejecutar consulta
    const dreams = await Dream.find(query)
      .sort(sort)
      .skip(startIndex)
      .limit(limit)
      .select('-__v')
      .populate('analysis', 'generalInterpretation emotionalAnalysis.primaryEmotion symbolAnalysis.symbol patternIdentification.recurringThemes');
    
    // Obtener total para paginación
    const total = await Dream.countDocuments(query);
    
    // Construir metadata de paginación
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit
    };
    
    res.status(200).json({
      success: true,
      count: dreams.length,
      pagination,
      data: dreams
    });
  } catch (error) {
    logger.error(`Error al obtener sueños: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudieron recuperar los sueños',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obtener un sueño específico
// @route   GET /api/dreams/:id
// @access  Privado
exports.getDream = async (req, res) => {
  try {
    const dream = await Dream.findById(req.params.id);
    
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
        message: 'No autorizado para eliminar este sueño'
      });
    }
    
    // Iniciar sesión de transacción
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Eliminar análisis asociado
      await Analysis.deleteOne({ dream: req.params.id }, { session });
      
      // Eliminar sueño
      await Dream.deleteOne({ _id: req.params.id }, { session });
      
      // Confirmar transacción
      await session.commitTransaction();
      
      res.status(200).json({
        success: true,
        message: 'Sueño eliminado exitosamente'
      });
    } catch (error) {
      // Revertir transacción en caso de error
      await session.abortTransaction();
      throw error;
    } finally {
      // Finalizar sesión
      session.endSession();
    }
  } catch (error) {
    // Verificar si el error es de ID inválido
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Sueño no encontrado'
      });
    }
    
    logger.error(`Error al eliminar sueño: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudo eliminar el sueño',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obtener estadísticas de sueños
// @route   GET /api/dreams/stats
// @access  Privado
exports.getDreamStats = async (req, res) => {
  try {
    // Período de tiempo (por defecto último mes)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (parseInt(req.query.months) || 1));
    
    // Estadísticas de emociones
    const emotionStats = await Dream.aggregate([
      { $match: { user: mongoose.Types.ObjectId(req.user.id), dreamDate: { $gte: startDate, $lte: endDate } } },
      { $unwind: '$emotions' },
      { $group: {
          _id: '$emotions.name',
          count: { $sum: 1 },
          averageIntensity: { $avg: '$emotions.intensity' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Estadísticas de temas
    const tagStats = await Dream.aggregate([
      { $match: { user: mongoose.Types.ObjectId(req.user.id), dreamDate: { $gte: startDate, $lte: endDate } } },
      { $unwind: '$tags' },
      { $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Estadísticas de calidad del sueño
    const sleepQualityStats = await Dream.aggregate([
      { $match: { user: mongoose.Types.ObjectId(req.user.id), dreamDate: { $gte: startDate, $lte: endDate }, sleepQuality: { $ne: null } } },
      { $group: {
          _id: null,
          average: { $avg: '$sleepQuality' },
          min: { $min: '$sleepQuality' },
          max: { $max: '$sleepQuality' }
        }
      }
    ]);
    
    // Frecuencia de sueños por día de la semana
    const weekdayStats = await Dream.aggregate([
      { $match: { user: mongoose.Types.ObjectId(req.user.id), dreamDate: { $gte: startDate, $lte: endDate } } },
      { $addFields: {
          dayOfWeek: { $dayOfWeek: '$dreamDate' }
        }
      },
      { $group: {
          _id: '$dayOfWeek',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Tendencias de temas recurrentes de los análisis
    const recurringThemesStats = await Analysis.aggregate([
      { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
      { $lookup: {
          from: 'dreams',
          localField: 'dream',
          foreignField: '_id',
          as: 'dreamData'
        }
      },
      { $unwind: '$dreamData' },
      { $match: { 'dreamData.dreamDate': { $gte: startDate, $lte: endDate } } },
      { $unwind: '$patternIdentification.recurringThemes' },
      { $group: {
          _id: '$patternIdentification.recurringThemes',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        emotionStats,
        tagStats,
        sleepQualityStats: sleepQualityStats[0] || { average: 0, min: 0, max: 0 },
        weekdayStats,
        recurringThemesStats
      }
    });
  } catch (error) {
    logger.error(`Error al obtener estadísticas de sueños: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudieron recuperar las estadísticas',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Obtener símbolos comunes del usuario
// @route   GET /api/dreams/symbols
// @access  Privado
exports.getSymbols = async (req, res) => {
  try {
    // Obtener símbolos de todos los análisis del usuario
    const symbolStats = await Analysis.aggregate([
      { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
      { $unwind: '$symbolAnalysis' },
      { $group: {
          _id: '$symbolAnalysis.symbol',
          count: { $sum: 1 },
          interpretations: { $push: '$symbolAnalysis.interpretation' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    
    res.status(200).json({
      success: true,
      count: symbolStats.length,
      data: symbolStats
    });
  } catch (error) {
    logger.error(`Error al obtener símbolos: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudieron recuperar los símbolos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Guardar feedback del usuario sobre un análisis
// @route   POST /api/dreams/:id/feedback
// @access  Privado
exports.saveFeedback = async (req, res) => {
  try {
    const { accuracy, helpfulness, insightfulness, comments } = req.body;
    
    // Validar campos
    if (!accuracy || !helpfulness || !insightfulness) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporcione una valoración para todos los campos requeridos'
      });
    }
    
    // Validar rango (1-5)
    if (accuracy < 1 || accuracy > 5 || helpfulness < 1 || helpfulness > 5 || insightfulness < 1 || insightfulness > 5) {
      return res.status(400).json({
        success: false,
        message: 'Las valoraciones deben estar en un rango de 1 a 5'
      });
    }
    
    // Buscar el análisis
    const analysis = await Analysis.findOne({ dream: req.params.id, user: req.user.id });
    
    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Análisis no encontrado'
      });
    }
    
    // Actualizar feedback
    analysis.userFeedback = {
      accuracy,
      helpfulness,
      insightfulness,
      comments: comments || ''
    };
    
    await analysis.save();
    
    res.status(200).json({
      success: true,
      message: 'Feedback guardado exitosamente',
      data: analysis.userFeedback
    });
  } catch (error) {
    logger.error(`Error al guardar feedback: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudo guardar el feedback',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = exports;d)
      .populate('analysis')
      .populate('user', 'username');
    
    // Verificar si el sueño existe
    if (!dream) {
      return res.status(404).json({
        success: false,
        message: 'Sueño no encontrado'
      });
    }
    
    // Verificar propiedad del sueño (solo el propietario puede verlo)
    if (dream.user._id.toString() !== req.user.id && req.user.role !== 'administrador') {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver este sueño'
      });
    }
    
    res.status(200).json({
      success: true,
      data: dream
    });
  } catch (error) {
    // Verificar si el error es de ID inválido
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Sueño no encontrado'
      });
    }
    
    logger.error(`Error al obtener sueño: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudo recuperar el sueño',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Actualizar un sueño
// @route   PUT /api/dreams/:id
// @access  Privado
exports.updateDream = async (req, res) => {
  try {
    let dream = await Dream.findById(req.params.id);
    
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
        message: 'No autorizado para modificar este sueño'
      });
    }
    
    // Actualizar el sueño
    const updatedDream = await Dream.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    // Si se actualizaron datos importantes, regenerar el análisis
    const significantChanges = ['content', 'emotions', 'characters', 'settings', 'tags'].some(field => 
      req.body[field] !== undefined
    );
    
    if (significantChanges) {
      // Obtener información relevante del usuario (sin datos personales)
      const user = await User.findById(req.user.id, 'demographics preferences createdAt');
      
      // Obtener historial reciente de sueños (para contexto)
      const dreamHistory = await Dream.find({ 
        user: req.user.id,
        _id: { $ne: updatedDream._id }
      })
        .sort({ dreamDate: -1 })
        .limit(5)
        .select('title content dreamDate emotions tags');
      
      // Obtener conteo total de sueños
      const dreamCount = await Dream.countDocuments({ user: req.user.id });
      
      // Preparar datos para el análisis
      const dreamData = updatedDream.toObject();
      dreamData.dreamHistory = dreamHistory;
      
      const userData = user.toObject();
      userData.dreamCount = dreamCount;
      
      // Eliminar análisis anterior
      await Analysis.deleteOne({ dream: updatedDream._id });
      
      // Generar nuevo análisis con IA (asíncrono)
      generateAnalysis(dreamData, userData, req.user.id);
    }
    
    res.status(200).json({
      success: true,
      data: updatedDream,
      message: significantChanges 
        ? 'Sueño actualizado exitosamente. El análisis se actualizará en breve.'
        : 'Sueño actualizado exitosamente.'
    });
  } catch (error) {
    // Verificar si el error es de ID inválido
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Sueño no encontrado'
      });
    }
    
    logger.error(`Error al actualizar sueño: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudo actualizar el sueño',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Eliminar un sueño
// @route   DELETE /api/dreams/:id
// @access  Privado
exports.deleteDream = async (req, res) => {
  try {
    const dream = await Dream.findById(req.params.i
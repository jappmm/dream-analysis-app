const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  dream: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dream',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Análisis general del sueño
  generalInterpretation: {
    type: String,
    required: true
  },
  // Análisis de símbolos específicos
  symbolAnalysis: [{
    symbol: {
      type: String,
      required: true
    },
    interpretation: {
      type: String,
      required: true
    },
    psychologicalContext: String,
    culturalReferences: [String]
  }],
  // Análisis emocional
  emotionalAnalysis: {
    primaryEmotion: String,
    emotionalThemes: [String],
    emotionalPatterns: String,
    subconscientExpressions: String
  },
  // Patrones identificados
  patternIdentification: {
    recurringThemes: [String],
    connectionToPreviousDreams: String,
    personalPatterns: [String]
  },
  // Perspectivas psicológicas
  psychologicalPerspectives: [{
    framework: {
      type: String,
      enum: ['jungiano', 'freudiano', 'gestalt', 'cognitivo', 'neurociencia', 'otro'],
      required: true
    },
    interpretation: {
      type: String,
      required: true
    }
  }],
  // Posibles significados en la vida consciente
  realLifeConnections: {
    potentialInfluences: [String],
    suggestedReflections: [String],
    lifeAreaImpacts: [{
      area: {
        type: String,
        enum: ['personal', 'relaciones', 'profesional', 'salud', 'espiritual', 'creativo', 'otro']
      },
      description: String
    }]
  },
  // Preguntas reflexivas para el usuario
  reflectiveQuestions: [String],
  // Recomendaciones y sugerencias
  recommendations: {
    journalingPrompts: [String],
    mindfulnessExercises: [String],
    creativeExplorations: [String],
    practicalActions: [String]
  },
  // Indicadores que podrían requerir atención profesional
  professionalAttentionFlags: {
    hasFlags: {
      type: Boolean,
      default: false
    },
    flagReasons: [String],
    suggestionLevel: {
      type: String,
      enum: ['informativo', 'recomendado', 'importante'],
      default: 'informativo'
    }
  },
  // Metadata del análisis
  analysisMetadata: {
    aiModel: String,
    confidenceScore: {
      type: Number,
      min: 0,
      max: 1
    },
    analysisVersion: String,
    processingTime: Number,
    followUpRecommended: {
      type: Boolean,
      default: false
    }
  },
  // Feedback del usuario sobre el análisis
  userFeedback: {
    accuracy: {
      type: Number,
      min: 1,
      max: 5
    },
    helpfulness: {
      type: Number,
      min: 1,
      max: 5
    },
    insightfulness: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para mejorar la eficiencia de consultas
AnalysisSchema.index({ dream: 1, user: 1 }, { unique: true });
AnalysisSchema.index({ 'symbolAnalysis.symbol': 1 });
AnalysisSchema.index({ 'emotionalAnalysis.primaryEmotion': 1 });
AnalysisSchema.index({ 'patternIdentification.recurringThemes': 1 });

// Método para obtener una versión resumida del análisis
AnalysisSchema.methods.getSummary = function() {
  return {
    _id: this._id,
    dream: this.dream,
    generalInterpretation: this.generalInterpretation,
    primaryEmotion: this.emotionalAnalysis.primaryEmotion,
    keySymbols: this.symbolAnalysis.map(s => s.symbol),
    recurringThemes: this.patternIdentification.recurringThemes,
    createdAt: this.createdAt
  };
};

// Método para anonimizar el análisis para investigación
AnalysisSchema.methods.anonymize = function() {
  const anonymized = this.toObject();
  
  // Eliminar identificadores directos
  delete anonymized.user;
  delete anonymized._id;
  delete anonymized.dream;
  delete anonymized.__v;
  
  // Incluir metadatos de investigación
  anonymized.researchMetadata = {
    anonymizedOn: new Date(),
    dataCategory: 'dream_analysis',
    includesPersonalInfo: false
  };
  
  return anonymized;
};

module.exports = mongoose.model('Analysis', AnalysisSchema);
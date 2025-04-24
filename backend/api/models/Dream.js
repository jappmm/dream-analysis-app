const mongoose = require('mongoose');

const DreamSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Por favor proporcione un título para su sueño'],
    trim: true,
    maxlength: [100, 'El título no puede tener más de 100 caracteres']
  },
  content: {
    type: String,
    required: [true, 'Por favor proporcione una descripción de su sueño'],
    minlength: [10, 'La descripción debe tener al menos 10 caracteres']
  },
  dreamDate: {
    type: Date,
    default: Date.now
  },
  emotions: [{
    name: {
      type: String,
      required: true
    },
    intensity: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    }
  }],
  symbols: [{
    name: String,
    description: String,
    significance: String
  }],
  settings: [{
    type: String
  }],
  characters: [{
    name: String,
    relation: String,
    description: String
  }],
  lucidity: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  tags: [{
    type: String
  }],
  isRecurring: {
    type: Boolean,
    default: false
  },
  isNightmare: {
    type: Boolean,
    default: false
  },
  sleepQuality: {
    type: Number,
    min: 1,
    max: 10
  },
  lifeSituation: {
    type: String
  },
  isPrivate: {
    type: Boolean,
    default: true
  },
  isAnonymizedForResearch: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals para análisis
DreamSchema.virtual('analysis', {
  ref: 'Analysis',
  localField: '_id',
  foreignField: 'dream',
  justOne: true
});

// Índices para búsquedas eficientes
DreamSchema.index({ user: 1, dreamDate: -1 });
DreamSchema.index({ tags: 1 });
DreamSchema.index({ content: 'text', title: 'text' });

// Método para anonimizar el sueño para investigación
DreamSchema.methods.anonymize = function() {
  const anonymized = this.toObject();
  
  // Eliminar identificadores directos
  delete anonymized.user;
  delete anonymized._id;
  delete anonymized.__v;
  
  // Generalizar información demográfica si es necesario
  if (anonymized.characters) {
    anonymized.characters = anonymized.characters.map(character => ({
      ...character,
      name: 'Persona anónima',
      relation: character.relation
    }));
  }
  
  return anonymized;
};

module.exports = mongoose.model('Dream', DreamSchema);
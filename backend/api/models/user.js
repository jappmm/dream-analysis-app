const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Por favor proporcione un nombre de usuario'],
    unique: true,
    trim: true,
    minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres'],
    maxlength: [20, 'El nombre de usuario no puede tener más de 20 caracteres']
  },
  email: {
    type: String,
    required: [true, 'Por favor proporcione un correo electrónico'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor proporcione un correo electrónico válido'
    ]
  },
  password: {
    type: String,
    required: [true, 'Por favor proporcione una contraseña'],
    minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
    select: false
  },
  demographics: {
    age: {
      type: Number,
      min: [13, 'La edad mínima es 13 años'],
      max: [99, 'La edad máxima es 99 años']
    },
    gender: {
      type: String,
      enum: ['masculino', 'femenino', 'no binario', 'prefiero no decir', 'otro']
    },
    location: String,
    occupation: String
  },
  preferences: {
    theme: {
      type: String,
      enum: ['claro', 'oscuro', 'sistema'],
      default: 'sistema'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    privacyLevel: {
      type: String,
      enum: ['básico', 'avanzado', 'máximo'],
      default: 'avanzado'
    },
    dataSharing: {
      type: Boolean,
      default: false
    }
  },
  role: {
    type: String,
    enum: ['usuario', 'investigador', 'administrador'],
    default: 'usuario'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  confirmEmailToken: String,
  isEmailConfirmed: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encriptar contraseña utilizando bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generar token para resetear contraseña
UserSchema.methods.getResetPasswordToken = function() {
  // Generar token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Establecer token en la base de datos en un formato hasheado
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Establecer expiración
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutos

  return resetToken;
};

// Generar token para confirmar email
UserSchema.methods.getEmailConfirmationToken = function() {
  // Generar token
  const confirmationToken = crypto.randomBytes(20).toString('hex');

  // Establecer token en la base de datos en un formato hasheado
  this.confirmEmailToken = crypto
    .createHash('sha256')
    .update(confirmationToken)
    .digest('hex');

  return confirmationToken;
};

module.exports = mongoose.model('User', UserSchema);
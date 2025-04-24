const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const logger = require('../../utils/logger');
const Dream = require('../models/Dream');
const Analysis = require('../models/Analysis');
const sendEmail = require('../../utils/sendEmail');

// @desc    Registrar usuario
// @route   POST /api/users/register
// @access  Público
exports.register = async (req, res) => {
  try {
    const { username, email, password, demographics } = req.body;
    
    // Verificar si el email ya está en uso
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya está registrado'
      });
    }
    
    // Verificar si el username ya está en uso
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de usuario ya está en uso'
      });
    }
    
    // Crear usuario
    const user = await User.create({
      username,
      email,
      password,
      demographics: demographics || {}
    });
    
    // Generar token de confirmación de email
    const confirmationToken = user.getEmailConfirmationToken();
    await user.save({ validateBeforeSave: false });
    
    // Crear URL de confirmación
    const confirmUrl = `${req.protocol}://${req.get('host')}/api/users/confirmemail/${confirmationToken}`;
    
    // Enviar email de confirmación
    try {
      await sendEmail({
        email: user.email,
        subject: 'Confirma tu correo electrónico',
        message: `Por favor confirma tu correo electrónico haciendo clic en el siguiente enlace: \n\n ${confirmUrl} \n\n Si no solicitaste esto, por favor ignora este correo.`
      });
      
      // Enviar respuesta
      sendTokenResponse(user, 201, res, 'Usuario registrado exitosamente. Por favor revisa tu correo electrónico para confirmar tu cuenta.');
    } catch (error) {
      logger.error(`Error al enviar email de confirmación: ${error.message}`);
      
      // Eliminar token de confirmación si hay error en el envío
      user.confirmEmailToken = undefined;
      await user.save({ validateBeforeSave: false });
      
      sendTokenResponse(user, 201, res, 'Usuario registrado exitosamente. Hubo un problema al enviar el correo de confirmación.');
    }
  } catch (error) {
    logger.error(`Error al registrar usuario: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudo registrar el usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Iniciar sesión
// @route   POST /api/users/login
// @access  Público
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validar email y password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporcione un correo electrónico y contraseña'
      });
    }
    
    // Verificar si el usuario existe
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Verificar si la contraseña coincide
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Actualizar última actividad
    user.lastActive = Date.now();
    await user.save({ validateBeforeSave: false });
    
    sendTokenResponse(user, 200, res, 'Inicio de sesión exitoso');
  } catch (error) {
    logger.error(`Error al iniciar sesión: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Cerrar sesión
// @route   GET /api/users/logout
// @access  Privado
exports.logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  
  res.status(200).json({
    success: true,
    message: 'Sesión cerrada exitosamente'
  });
};

// @desc    Obtener usuario actual
// @route   GET /api/users/me
// @access  Privado
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Obtener estadísticas básicas
    const dreamCount = await Dream.countDocuments({ user: req.user.id });
    const analysisCount = await Analysis.countDocuments({ user: req.user.id });
    
    // Agregar estadísticas al objeto de usuario
    const userData = user.toObject();
    userData.stats = {
      dreamCount,
      analysisCount,
      memberSince: user.createdAt,
      lastActive: user.lastActive
    };
    
    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    logger.error(`Error al obtener perfil de usuario: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudo recuperar la información del usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Actualizar datos de usuario
// @route   PUT /api/users/updatedetails
// @access  Privado
exports.updateDetails = async (req, res) => {
  try {
    const fieldsToUpdate = {
      username: req.body.username,
      demographics: req.body.demographics,
      preferences: req.body.preferences
    };
    
    // Filtrar campos undefined
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );
    
    // Verificar si el nuevo username ya está en uso
    if (fieldsToUpdate.username) {
      const usernameExists = await User.findOne({ 
        username: fieldsToUpdate.username,
        _id: { $ne: req.user.id }
      });
      
      if (usernameExists) {
        return res.status(400).json({
          success: false,
          message: 'El nombre de usuario ya está en uso'
        });
      }
    }
    
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: user,
      message: 'Perfil actualizado exitosamente'
    });
  } catch (error) {
    logger.error(`Error al actualizar perfil: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudo actualizar el perfil',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Actualizar contraseña
// @route   PUT /api/users/updatepassword
// @access  Privado
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validar entradas
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporcione la contraseña actual y la nueva contraseña'
      });
    }
    
    const user = await User.findById(req.user.id).select('+password');
    
    // Verificar contraseña actual
    const isMatch = await user.matchPassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }
    
    // Actualizar contraseña
    user.password = newPassword;
    await user.save();
    
    sendTokenResponse(user, 200, res, 'Contraseña actualizada exitosamente');
  } catch (error) {
    logger.error(`Error al actualizar contraseña: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudo actualizar la contraseña',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Solicitar restablecimiento de contraseña
// @route   POST /api/users/forgotpassword
// @access  Público
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No hay usuario con ese correo electrónico'
      });
    }
    
    // Obtener token de restablecimiento
    const resetToken = user.getResetPasswordToken();
    
    await user.save({ validateBeforeSave: false });
    
    // Crear URL de restablecimiento
    const resetUrl = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;
    
    const message = `Recibiste este correo porque tú (o alguien más) solicitó restablecer la contraseña. Por favor haz clic en el siguiente enlace para continuar: \n\n ${resetUrl} \n\n Este enlace expirará en 10 minutos. Si no solicitaste esto, por favor ignora este correo.`;
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'Restablecimiento de contraseña',
        message
      });
      
      res.status(200).json({
        success: true,
        message: 'Correo electrónico enviado'
      });
    } catch (error) {
      logger.error(`Error al enviar email de restablecimiento: ${error.message}`);
      
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      
      await user.save({ validateBeforeSave: false });
      
      return res.status(500).json({
        success: false,
        message: 'No se pudo enviar el correo electrónico'
      });
    }
  } catch (error) {
    logger.error(`Error en solicitud de restablecimiento: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Error en la solicitud de restablecimiento',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Restablecer contraseña
// @route   PUT /api/users/resetpassword/:resettoken
// @access  Público
exports.resetPassword = async (req, res) => {
  try {
    // Obtener token hasheado
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');
    
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }
    
    // Establecer nueva contraseña
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();
    
    sendTokenResponse(user, 200, res, 'Contraseña restablecida exitosamente');
  } catch (error) {
    logger.error(`Error al restablecer contraseña: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudo restablecer la contraseña',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Confirmar correo electrónico
// @route   GET /api/users/confirmemail/:confirmtoken
// @access  Público
exports.confirmEmail = async (req, res) => {
  try {
    // Obtener token hasheado
    const confirmEmailToken = crypto
      .createHash('sha256')
      .update(req.params.confirmtoken)
      .digest('hex');
    
    const user = await User.findOne({ confirmEmailToken });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    // Actualizar estado de confirmación
    user.isEmailConfirmed = true;
    user.confirmEmailToken = undefined;
    
    await user.save({ validateBeforeSave: false });
    
    // Redireccionar a la aplicación
    res.redirect(`${process.env.FRONTEND_URL}/login?confirmed=true`);
  } catch (error) {
    logger.error(`Error al confirmar email: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudo confirmar el correo electrónico',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Eliminar cuenta de usuario
// @route   DELETE /api/users/deleteaccount
// @access  Privado
exports.deleteAccount = async (req, res) => {
  try {
    // Verificar contraseña para confirmar eliminación
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporcione su contraseña para confirmar la eliminación'
      });
    }
    
    const user = await User.findById(req.user.id).select('+password');
    
    // Verificar contraseña
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña incorrecta'
      });
    }
    
    // Iniciar sesión de transacción
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Eliminar todos los análisis del usuario
      await Analysis.deleteMany({ user: req.user.id }, { session });
      
      // Eliminar todos los sueños del usuario
      await Dream.deleteMany({ user: req.user.id }, { session });
      
      // Eliminar el usuario
      await User.deleteOne({ _id: req.user.id }, { session });
      
      // Confirmar transacción
      await session.commitTransaction();
      
      res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
      });
      
      res.status(200).json({
        success: true,
        message: 'Cuenta eliminada exitosamente'
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
    logger.error(`Error al eliminar cuenta: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'No se pudo eliminar la cuenta',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Función para generar token y enviar respuesta
const sendTokenResponse = (user, statusCode, res, message) => {
  // Crear token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
  
  // Opciones de cookie
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  
  // Usar HTTPS en producción
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  
  // Extraer datos de usuario sin campos sensibles
  const userData = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    demographics: user.demographics,
    preferences: user.preferences,
    isEmailConfirmed: user.isEmailConfirmed,
    createdAt: user.createdAt
  };
  
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      token,
      data: userData
    });
};

module.exports = exports;
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../../utils/logger');

// Middleware para proteger rutas
exports.protect = async (req, res, next) => {
  let token;
  
  // Verificar si hay token en los headers o en las cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extraer token del header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Extraer token de la cookie
    token = req.cookies.token;
  }
  
  // Verificar si existe el token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado para acceder a esta ruta'
    });
  }
  
  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }
    
    // Actualizar último acceso
    user.lastActive = Date.now();
    await user.save({ validateBeforeSave: false });
    
    // Adjuntar usuario al request
    req.user = {
      id: user._id,
      role: user.role
    };
    
    next();
  } catch (error) {
    logger.error(`Error en autenticación: ${error.message}`);
    
    return res.status(401).json({
      success: false,
      message: 'No autorizado para acceder a esta ruta'
    });
  }
};

// Middleware para restringir acceso según roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `El rol ${req.user.role} no está autorizado para acceder a esta ruta`
      });
    }
    next();
  };
};
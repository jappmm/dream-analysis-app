const logger = require('../../utils/logger');

// Middleware de manejo de errores global
exports.errorHandler = (err, req, res, next) => {
  // Loguear el error para depuración
  logger.error(`Error: ${err.stack}`);
  
  // Preparar respuesta
  let error = { ...err };
  error.message = err.message;
  
  // Errores de Mongoose: ID inválido
  if (err.name === 'CastError') {
    const message = 'Recurso no encontrado';
    error = { message, statusCode: 404 };
  }
  
  // Errores de Mongoose: Error de validación
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }
  
  // Errores de Mongoose: Duplicado
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Valor duplicado en el campo: ${field}. Por favor use otro valor`;
    error = { message, statusCode: 400 };
  }
  
  // Error JWT: Token inválido
  if (err.name === 'JsonWebTokenError') {
    const message = 'No autorizado. Token inválido';
    error = { message, statusCode: 401 };
  }
  
  // Error JWT: Token expirado
  if (err.name === 'TokenExpiredError') {
    const message = 'No autorizado. Token expirado';
    error = { message, statusCode: 401 };
  }
  
  // Responder con el error
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error del servidor',
    stackTrace: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
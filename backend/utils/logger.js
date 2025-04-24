const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Crear directorio de logs si no existe
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Definir configuración según entorno
const isProd = process.env.NODE_ENV === 'production';

// Definir formato de logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Definir formato para la consola
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    info => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`
  )
);

// Crear instancia de logger
const logger = winston.createLogger({
  level: isProd ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'dream-analysis-api' },
  transports: [
    // Archivo de logs para errores
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Archivo de logs combinados
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Añadir logging a la consola en desarrollo
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// Crear streams para Morgan
logger.stream = {
  write: (message) => logger.info(message.trim()),
};

// Funciones auxiliares para crear metadatos consistentes
logger.logAPIRequest = (req, extra = {}) => {
  const meta = {
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
    user: req.user ? req.user.id : 'anonymous',
    userAgent: req.get('user-agent'),
    ...extra,
  };
  
  logger.info(`API Request: ${req.method} ${req.originalUrl}`, meta);
};

logger.logAPIResponse = (req, res, responseTime, extra = {}) => {
  const meta = {
    ip: req.ip,
    method: req.method,
    url: req.originalUrl,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    user: req.user ? req.user.id : 'anonymous',
    ...extra,
  };
  
  logger.info(`API Response: ${res.statusCode} ${req.method} ${req.originalUrl} (${responseTime}ms)`, meta);
};

logger.logError = (error, req = null, extra = {}) => {
  const meta = {
    ...(req ? {
      ip: req.ip,
      method: req.method,
      url: req.originalUrl,
      user: req.user ? req.user.id : 'anonymous',
    } : {}),
    ...extra,
  };
  
  logger.error(`${error.message}`, {
    error,
    ...meta,
  });
};

// Máscara para datos sensibles en logs
logger.maskSensitiveData = (data) => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  const maskedData = { ...data };
  
  // Campos a enmascarar
  const sensitiveFields = [
    'password', 'oldPassword', 'newPassword', 'confirmPassword',
    'token', 'resetToken', 'accessToken', 'refreshToken',
    'credit_card', 'creditCard', 'cardNumber',
    'ssn', 'socialSecurity',
  ];
  
  for (const key in maskedData) {
    if (sensitiveFields.includes(key.toLowerCase())) {
      maskedData[key] = '[REDACTED]';
    } else if (typeof maskedData[key] === 'object' && maskedData[key] !== null) {
      maskedData[key] = logger.maskSensitiveData(maskedData[key]);
    }
  }
  
  return maskedData;
};

module.exports = logger;
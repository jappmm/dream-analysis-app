// Configuración de seguridad
const SECURITY_CONFIG = {
  // Configuración de contraseñas
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },
  
  // Configuración de tokens JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRE || '30d',
    cookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE || '30')
  },
  
  // Configuración de encriptación
  encryption: {
    algorithm: 'aes-256-cbc',
    key: process.env.ENCRYPTION_KEY,
    iv: process.env.ENCRYPTION_IV
  },
  
  // Configuración de sanitización
  sanitization: {
    enableMongoSanitize: true,
    enableXSS: true
  },
  
  // Configuración de límites de tasa (rate limiting)
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limitar cada IP a 100 solicitudes por ventana
    message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo en 15 minutos'
  },
  
  // Configuración de CORS
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL || 'https://yourapp.com'
      : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  
  // Lista de rutas que no requieren autenticación
  publicRoutes: [
    { path: '/api/users/login', method: 'POST' },
    { path: '/api/users/register', method: 'POST' },
    { path: '/api/users/forgotpassword', method: 'POST' },
    { path: '/api/users/resetpassword/:resettoken', method: 'PUT' },
    { path: '/api/users/confirmemail/:confirmtoken', method: 'GET' }
  ]
};

module.exports = SECURITY_CONFIG;
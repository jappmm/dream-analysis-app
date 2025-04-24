const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    logger.info(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error al conectar a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Manejar eventos de conexión
mongoose.connection.on('connected', () => {
  logger.info('Mongoose conectado a la base de datos');
});

mongoose.connection.on('error', (err) => {
  logger.error(`Error de conexión Mongoose: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose desconectado de la base de datos');
});

// Manejar cierre de la aplicación
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('Conexión a la base de datos cerrada por terminación de la aplicación');
  process.exit(0);
});

module.exports = connectDB;
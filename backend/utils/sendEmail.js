const nodemailer = require('nodemailer');
const logger = require('./logger');

/**
 * Enviar correo electrónico
 * @param {Object} options Opciones del correo
 * @param {string} options.email Correo del destinatario
 * @param {string} options.subject Asunto del correo
 * @param {string} options.message Mensaje de texto plano
 * @param {string} options.html Mensaje en formato HTML (opcional)
 * @returns {Promise} Resultado del envío
 */
const sendEmail = async (options) => {
  // Crear transportador para desarrollo o producción
  let transporter;
  
  if (process.env.NODE_ENV === 'production') {
    // Configuración para un servicio real de correo en producción
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  } else {
    // Configuración para desarrollo usando Ethereal (correos de prueba)
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
  
  // Configurar mensaje
  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  
  // Añadir HTML si está disponible
  if (options.html) {
    message.html = options.html;
  }
  
  // Añadir archivos adjuntos si están disponibles
  if (options.attachments) {
    message.attachments = options.attachments;
  }
  
  try {
    // Enviar correo
    const info = await transporter.sendMail(message);
    
    logger.info(`Correo enviado: ${info.messageId}`);
    
    // En desarrollo, mostrar URL de previsualización de Ethereal
    if (process.env.NODE_ENV !== 'production') {
      logger.info(`URL de previsualización: ${nodemailer.getTestMessageUrl(info)}`);
    }
    
    return info;
  } catch (error) {
    logger.error(`Error al enviar correo: ${error.message}`);
    throw error;
  }
};

module.exports = sendEmail;
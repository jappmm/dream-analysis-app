const crypto = require('crypto');
const logger = require('../utils/logger');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-cbc';
    this.key = Buffer.from(process.env.ENCRYPTION_KEY || '', 'hex');
    this.iv = Buffer.from(process.env.ENCRYPTION_IV || '', 'hex');
  }
  
  /**
   * Encripta un texto
   * @param {string} text - Texto a encriptar
   * @returns {string} - Texto encriptado en formato hex
   */
  encrypt(text) {
    try {
      if (!text) return '';
      
      const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    } catch (error) {
      logger.error(`Error al encriptar datos: ${error.message}`);
      return '';
    }
  }
  
  /**
   * Desencripta un texto
   * @param {string} encryptedText - Texto encriptado en formato hex
   * @returns {string} - Texto desencriptado
   */
  decrypt(encryptedText) {
    try {
      if (!encryptedText) return '';
      
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      logger.error(`Error al desencriptar datos: ${error.message}`);
      return '';
    }
  }
  
  /**
   * Encripta un objeto JSON
   * @param {Object} data - Objeto a encriptar
   * @returns {string} - Objeto encriptado en formato hex
   */
  encryptObject(data) {
    try {
      const jsonString = JSON.stringify(data);
      return this.encrypt(jsonString);
    } catch (error) {
      logger.error(`Error al encriptar objeto: ${error.message}`);
      return '';
    }
  }
  
  /**
   * Desencripta un objeto JSON
   * @param {string} encryptedData - Objeto encriptado en formato hex
   * @returns {Object|null} - Objeto desencriptado
   */
  decryptObject(encryptedData) {
    try {
      const jsonString = this.decrypt(encryptedData);
      return JSON.parse(jsonString);
    } catch (error) {
      logger.error(`Error al desencriptar objeto: ${error.message}`);
      return null;
    }
  }
  
  /**
   * Anonimiza datos sensibles reemplazando partes con asteriscos
   * @param {string} text - Texto a anonimizar
   * @param {number} visibleStart - Caracteres visibles al inicio
   * @param {number} visibleEnd - Caracteres visibles al final
   * @returns {string} - Texto anonimizado
   */
  anonymize(text, visibleStart = 2, visibleEnd = 2) {
    if (!text || text.length <= visibleStart + visibleEnd) {
      return text;
    }
    
    const start = text.substring(0, visibleStart);
    const end = text.substring(text.length - visibleEnd);
    const maskedLength = text.length - visibleStart - visibleEnd;
    const masked = '*'.repeat(maskedLength);
    
    return start + masked + end;
  }
  
  /**
   * Anonimiza un nombre completo
   * @param {string} fullName - Nombre completo
   * @returns {string} - Nombre anonimizado
   */
  anonymizeName(fullName) {
    if (!fullName) return '';
    
    const nameParts = fullName.trim().split(' ');
    
    if (nameParts.length === 1) {
      // Solo un nombre
      return this.anonymize(nameParts[0], 1, 1);
    } else if (nameParts.length === 2) {
      // Nombre y apellido
      const firstName = this.anonymize(nameParts[0], 1, 0);
      const lastName = this.anonymize(nameParts[1], 1, 0);
      return `${firstName} ${lastName}`;
    } else {
      // Múltiples nombres/apellidos
      const firstName = this.anonymize(nameParts[0], 1, 0);
      const lastName = this.anonymize(nameParts[nameParts.length - 1], 1, 0);
      return `${firstName} ... ${lastName}`;
    }
  }
  
  /**
   * Anonimiza una dirección de correo electrónico
   * @param {string} email - Correo electrónico
   * @returns {string} - Correo anonimizado
   */
  anonymizeEmail(email) {
    if (!email || !email.includes('@')) return '';
    
    const [username, domain] = email.split('@');
    const anonymizedUsername = this.anonymize(username, 2, 1);
    return `${anonymizedUsername}@${domain}`;
  }
  
  /**
   * Anonimiza datos personales en un texto
   * @param {string} text - Texto a procesar
   * @returns {string} - Texto con datos personales anonimizados
   */
  anonymizePersonalDataInText(text) {
    if (!text) return '';
    
    // Anonimizar posibles correos electrónicos
    let processed = text.replace(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      match => this.anonymizeEmail(match)
    );
    
    // Anonimizar posibles números de teléfono
    processed = processed.replace(
      /\b(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
      match => '***-***-' + match.slice(-4)
    );
    
    // Anonimizar posibles nombres completos (más difícil, implementación básica)
    // Esta es una implementación simple y no anonimizará todos los nombres
    const nameRegex = /\b([A-Z][a-z]+)(?:\s+([A-Z][a-z]+)){1,3}\b/g;
    processed = processed.replace(nameRegex, match => this.anonymizeName(match));
    
    return processed;
  }
  
  /**
   * Genera una clave de encriptación segura
   * @returns {Object} - Clave y vector de inicialización
   */
  static generateEncryptionKey() {
    const key = crypto.randomBytes(32).toString('hex');
    const iv = crypto.randomBytes(16).toString('hex');
    return { key, iv };
  }
  
  /**
   * Hash de texto usando SHA-256
   * @param {string} text - Texto a hashear
   * @returns {string} - Hash en formato hex
   */
  static hashText(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
  }
}

module.exports = new EncryptionService();
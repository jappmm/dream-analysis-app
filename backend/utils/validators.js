const validator = require('validator');

/**
 * Utilidades de validación para la aplicación
 */
const validators = {
  /**
   * Valida una dirección de correo electrónico
   * @param {string} email - Correo electrónico a validar
   * @returns {boolean} - true si es válido, false en caso contrario
   */
  isValidEmail: (email) => {
    if (!email) return false;
    return validator.isEmail(email);
  },

  /**
   * Valida una contraseña según los criterios de seguridad
   * @param {string} password - Contraseña a validar
   * @returns {Object} - Resultado de la validación con detalles
   */
  validatePassword: (password) => {
    if (!password) {
      return {
        isValid: false,
        message: 'La contraseña es requerida'
      };
    }

    // Definir criterios de validación
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    // Verificar longitud mínima
    if (password.length < minLength) {
      return {
        isValid: false,
        message: `La contraseña debe tener al menos ${minLength} caracteres`
      };
    }

    // Verificar complejidad
    if (!hasUppercase) {
      return {
        isValid: false,
        message: 'La contraseña debe incluir al menos una letra mayúscula'
      };
    }

    if (!hasLowercase) {
      return {
        isValid: false,
        message: 'La contraseña debe incluir al menos una letra minúscula'
      };
    }

    if (!hasNumber) {
      return {
        isValid: false,
        message: 'La contraseña debe incluir al menos un número'
      };
    }

    if (!hasSpecialChar) {
      return {
        isValid: false,
        message: 'La contraseña debe incluir al menos un carácter especial'
      };
    }

    return {
      isValid: true,
      message: 'Contraseña válida'
    };
  },

  /**
   * Valida un nombre de usuario
   * @param {string} username - Nombre de usuario a validar
   * @returns {Object} - Resultado de la validación con detalles
   */
  validateUsername: (username) => {
    if (!username) {
      return {
        isValid: false,
        message: 'El nombre de usuario es requerido'
      };
    }

    // Solo permitir letras, números, guiones y guiones bajos
    const validChars = /^[a-zA-Z0-9_-]+$/;
    if (!validChars.test(username)) {
      return {
        isValid: false,
        message: 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos'
      };
    }

    // Verificar longitud
    if (username.length < 3) {
      return {
        isValid: false,
        message: 'El nombre de usuario debe tener al menos 3 caracteres'
      };
    }

    if (username.length > 20) {
      return {
        isValid: false,
        message: 'El nombre de usuario no puede tener más de 20 caracteres'
      };
    }

    return {
      isValid: true,
      message: 'Nombre de usuario válido'
    };
  },

  /**
   * Valida una fecha
   * @param {string} date - Fecha a validar en formato ISO 8601
   * @returns {boolean} - true si es válida, false en caso contrario
   */
  isValidDate: (date) => {
    if (!date) return false;
    return validator.isISO8601(date);
  },

  /**
   * Sanitiza una cadena para prevenir XSS
   * @param {string} str - Cadena a sanitizar
   * @returns {string} - Cadena sanitizada
   */
  sanitizeString: (str) => {
    if (!str) return '';
    return validator.escape(str);
  },

  /**
   * Verifica si una cadena contiene HTML
   * @param {string} str - Cadena a verificar
   * @returns {boolean} - true si contiene HTML, false en caso contrario
   */
  containsHTML: (str) => {
    if (!str) return false;
    return /<[a-z/][\s\S]*>/i.test(str);
  },

  /**
   * Verifica si una cadena es un ObjectId de MongoDB válido
   * @param {string} id - ID a verificar
   * @returns {boolean} - true si es válido, false en caso contrario
   */
  isValidObjectId: (id) => {
    if (!id) return false;
    return /^[0-9a-fA-F]{24}$/.test(id);
  },

  /**
   * Valida los datos de un sueño
   * @param {Object} dreamData - Datos del sueño a validar
   * @returns {Object} - Errores encontrados o null si no hay errores
   */
  validateDreamData: (dreamData) => {
    const errors = {};

    // Validar título
    if (!dreamData.title || dreamData.title.trim() === '') {
      errors.title = 'El título es requerido';
    } else if (dreamData.title.length > 100) {
      errors.title = 'El título no puede tener más de 100 caracteres';
    }

    // Validar contenido
    if (!dreamData.content || dreamData.content.trim() === '') {
      errors.content = 'La descripción del sueño es requerida';
    } else if (dreamData.content.length < 10) {
      errors.content = 'La descripción debe tener al menos 10 caracteres';
    }

    // Validar fecha
    if (dreamData.dreamDate && !validators.isValidDate(dreamData.dreamDate)) {
      errors.dreamDate = 'La fecha no es válida';
    }

    // Validar calidad del sueño
    if (dreamData.sleepQuality !== undefined) {
      const sleepQuality = Number(dreamData.sleepQuality);
      if (isNaN(sleepQuality) || sleepQuality < 1 || sleepQuality > 10) {
        errors.sleepQuality = 'La calidad del sueño debe ser un número entre 1 y 10';
      }
    }

    // Validar nivel de lucidez
    if (dreamData.lucidity !== undefined) {
      const lucidity = Number(dreamData.lucidity);
      if (isNaN(lucidity) || lucidity < 0 || lucidity > 5) {
        errors.lucidity = 'El nivel de lucidez debe ser un número entre 0 y 5';
      }
    }

    return Object.keys(errors).length === 0 ? null : errors;
  },

  /**
   * Valida los datos de un usuario
   * @param {Object} userData - Datos del usuario a validar
   * @returns {Object} - Errores encontrados o null si no hay errores
   */
  validateUserData: (userData) => {
    const errors = {};

    // Validar nombre de usuario
    const usernameValidation = validators.validateUsername(userData.username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.message;
    }

    // Validar email
    if (!validators.isValidEmail(userData.email)) {
      errors.email = 'El correo electrónico no es válido';
    }

    // Validar contraseña si está presente
    if (userData.password) {
      const passwordValidation = validators.validatePassword(userData.password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.message;
      }
    }

    // Validar edad si está presente
    if (userData.demographics && userData.demographics.age !== undefined) {
      const age = Number(userData.demographics.age);
      if (isNaN(age) || age < 13 || age > 120) {
        errors.age = 'La edad debe ser un número entre 13 y 120';
      }
    }

    return Object.keys(errors).length === 0 ? null : errors;
  }
};

module.exports = validators;
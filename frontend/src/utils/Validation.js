/**
 * Utilidades para validación de datos en la aplicación
 */

/**
 * Valida una dirección de correo electrónico
 * @param {string} email - Correo electrónico a validar
 * @returns {boolean} true si el correo es válido
 */
export const isValidEmail = (email) => {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(String(email).toLowerCase());
};

/**
 * Valida la fortaleza de una contraseña
 * @param {string} password - Contraseña a validar
 * @returns {Object} Objeto con el resultado de la validación
 */
export const validatePassword = (password) => {
  // Definir los criterios de validación
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  // Calcular la puntuación de fortaleza (0-100)
  let strength = 0;
  
  if (password.length >= minLength) strength += 25;
  if (hasUpperCase) strength += 25;
  if (hasLowerCase) strength += 15;
  if (hasNumbers) strength += 15;
  if (hasSpecialChar) strength += 20;
  
  // Determinar el nivel de fortaleza
  let level = 'débil';
  if (strength >= 80) level = 'fuerte';
  else if (strength >= 50) level = 'media';
  
  // Generar mensaje de retroalimentación
  let feedback = [];
  
  if (password.length < minLength) {
    feedback.push(`Debe tener al menos ${minLength} caracteres`);
  }
  
  if (!hasUpperCase) {
    feedback.push('Debe incluir al menos una letra mayúscula');
  }
  
  if (!hasLowerCase) {
    feedback.push('Debe incluir al menos una letra minúscula');
  }
  
  if (!hasNumbers) {
    feedback.push('Debe incluir al menos un número');
  }
  
  if (!hasSpecialChar) {
    feedback.push('Debe incluir al menos un carácter especial');
  }
  
  return {
    isValid: strength >= 50, // Consideramos válida si tiene al menos fortaleza media
    strength,
    level,
    feedback
  };
};

/**
 * Valida que dos contraseñas coincidan
 * @param {string} password - Contraseña original
 * @param {string} confirmPassword - Confirmación de contraseña
 * @returns {boolean} true si las contraseñas coinciden
 */
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

/**
 * Valida un nombre de usuario
 * @param {string} username - Nombre de usuario a validar
 * @returns {Object} Objeto con el resultado de la validación
 */
export const validateUsername = (username) => {
  const minLength = 3;
  const maxLength = 30;
  const validChars = /^[a-zA-Z0-9_.-]+$/;
  
  const isValidLength = username.length >= minLength && username.length <= maxLength;
  const hasValidChars = validChars.test(username);
  
  let feedback = [];
  
  if (!isValidLength) {
    feedback.push(`Debe tener entre ${minLength} y ${maxLength} caracteres`);
  }
  
  if (!hasValidChars) {
    feedback.push('Solo puede contener letras, números, guiones, puntos y guiones bajos');
  }
  
  return {
    isValid: isValidLength && hasValidChars,
    feedback
  };
};

/**
 * Valida un número de teléfono
 * @param {string} phone - Número de teléfono a validar
 * @returns {boolean} true si el número es válido
 */
export const isValidPhone = (phone) => {
  // Acepta formatos internacionales y nacionales comunes
  const phoneRegex = /^(\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/;
  return phoneRegex.test(phone);
};

/**
 * Verifica si un texto excede el máximo de caracteres
 * @param {string} text - Texto a validar
 * @param {number} maxLength - Longitud máxima permitida
 * @returns {Object} Objeto con el resultado de la validación
 */
export const validateTextLength = (text, maxLength) => {
  const length = text.length;
  const isValid = length <= maxLength;
  
  return {
    isValid,
    length,
    remaining: maxLength - length,
    overLimit: length > maxLength ? length - maxLength : 0
  };
};

/**
 * Valida un campo requerido
 * @param {string} value - Valor a validar
 * @returns {boolean} true si el campo no está vacío
 */
export const isNotEmpty = (value) => {
  return value !== null && value !== undefined && String(value).trim() !== '';
};

/**
 * Valida una URL
 * @param {string} url - URL a validar
 * @returns {boolean} true si la URL es válida
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Valida una fecha
 * @param {string} date - Fecha a validar (formato YYYY-MM-DD)
 * @returns {boolean} true si la fecha es válida
 */
export const isValidDate = (date) => {
  // Verificar formato YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }
  
  // Verificar que sea una fecha válida
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return false;
  }
  
  // Asegurarse de que la fecha formateada coincida con la entrada
  // (esto evita fechas como 2022-02-31 que se convierten automáticamente a fechas válidas)
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}` === date;
};

/**
 * Valida que un número esté dentro de un rango
 * @param {number} value - Valor a validar
 * @param {number} min - Valor mínimo (opcional)
 * @param {number} max - Valor máximo (opcional)
 * @returns {boolean} true si el valor está dentro del rango
 */
export const isInRange = (value, min = null, max = null) => {
  const numValue = Number(value);
  
  if (isNaN(numValue)) {
    return false;
  }
  
  if (min !== null && numValue < min) {
    return false;
  }
  
  if (max !== null && numValue > max) {
    return false;
  }
  
  return true;
};

/**
 * Sanitiza texto para evitar inyección HTML
 * @param {string} input - Texto a sanitizar
 * @returns {string} Texto sanitizado
 */
export const sanitizeHtml = (input) => {
  return String(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Valida un formulario completo
 * @param {Object} values - Objeto con los valores del formulario
 * @param {Object} rules - Objeto con las reglas de validación
 * @returns {Object} Objeto con errores y estado de validación
 */
export const validateForm = (values, rules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = values[field];
    
    // Verificar regla de campo requerido
    if (fieldRules.required && !isNotEmpty(value)) {
      errors[field] = fieldRules.message || 'Este campo es requerido';
      isValid = false;
      return;
    }
    
    // Si el campo está vacío y no es requerido, no aplicar más validaciones
    if (!isNotEmpty(value) && !fieldRules.required) {
      return;
    }
    
    // Validar email
    if (fieldRules.email && !isValidEmail(value)) {
      errors[field] = fieldRules.message || 'Email inválido';
      isValid = false;
      return;
    }
    
    // Validar longitud mínima
    if (fieldRules.minLength && String(value).length < fieldRules.minLength) {
      errors[field] = fieldRules.message || 
        `Debe tener al menos ${fieldRules.minLength} caracteres`;
      isValid = false;
      return;
    }
    
    // Validar longitud máxima
    if (fieldRules.maxLength && String(value).length > fieldRules.maxLength) {
      errors[field] = fieldRules.message || 
        `No debe exceder ${fieldRules.maxLength} caracteres`;
      isValid = false;
      return;
    }
    
    // Validar expresión regular personalizada
    if (fieldRules.pattern && !fieldRules.pattern.test(String(value))) {
      errors[field] = fieldRules.message || 'Formato inválido';
      isValid = false;
      return;
    }
    
    // Validar rango numérico
    if (fieldRules.min !== undefined || fieldRules.max !== undefined) {
      if (!isInRange(value, fieldRules.min, fieldRules.max)) {
        errors[field] = fieldRules.message || 
          `Debe estar entre ${fieldRules.min || 'mínimo'} y ${fieldRules.max || 'máximo'}`;
        isValid = false;
        return;
      }
    }
    
    // Validación personalizada
    if (fieldRules.validate && typeof fieldRules.validate === 'function') {
      const customValidation = fieldRules.validate(value, values);
      
      if (customValidation !== true) {
        errors[field] = customValidation || fieldRules.message || 'Valor inválido';
        isValid = false;
      }
    }
  });
  
  return {
    isValid,
    errors
  };
};

// Exportar todas las funciones
export default {
  isValidEmail,
  validatePassword,
  passwordsMatch,
  validateUsername,
  isValidPhone,
  validateTextLength,
  isNotEmpty,
  isValidURL,
  isValidDate,
  isInRange,
  sanitizeHtml,
  validateForm
};
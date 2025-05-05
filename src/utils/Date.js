/**
 * Utilidades para el manejo de fechas en la aplicación
 */

/**
 * Formatea una fecha en formato legible
 * @param {string|Date} date - Fecha a formatear (string ISO o objeto Date)
 * @param {Object} options - Opciones de formato
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    locale: 'es-ES',
    showTime: false,
    format: 'long' // 'long', 'medium', 'short'
  };
  
  const config = { ...defaultOptions, ...options };
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Verificar si la fecha es válida
  if (isNaN(dateObj.getTime())) {
    return 'Fecha inválida';
  }
  
  let dateOptions = {};
  
  // Configurar opciones según el formato solicitado
  switch (config.format) {
    case 'long':
      dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      break;
    case 'medium':
      dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      break;
    case 'short':
      dateOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      };
      break;
    default:
      dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
  }
  
  // Añadir la hora si se solicita
  if (config.showTime) {
    dateOptions.hour = '2-digit';
    dateOptions.minute = '2-digit';
  }
  
  return dateObj.toLocaleDateString(config.locale, dateOptions);
};

/**
 * Obtiene la fecha actual en formato ISO
 * @returns {string} Fecha actual en formato ISO
 */
export const getCurrentDate = () => {
  return new Date().toISOString();
};

/**
 * Obtiene sólo la parte de la fecha del formato ISO (sin hora)
 * @param {string|Date} date - Fecha a procesar
 * @returns {string} Fecha en formato YYYY-MM-DD
 */
export const getDateOnly = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toISOString().split('T')[0];
};

/**
 * Calcula la diferencia en días entre dos fechas
 * @param {string|Date} date1 - Primera fecha
 * @param {string|Date} date2 - Segunda fecha
 * @returns {number} Diferencia en días
 */
export const daysBetweenDates = (date1, date2) => {
  const d1 = date1 instanceof Date ? date1 : new Date(date1);
  const d2 = date2 instanceof Date ? date2 : new Date(date2);
  
  // Convertir a días completos eliminando la parte de la hora
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  
  // Dividir por milisegundos en un día
  return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
};

/**
 * Verifica si una fecha es hoy
 * @param {string|Date} date - Fecha a verificar
 * @returns {boolean} true si la fecha es hoy
 */
export const isToday = (date) => {
  const today = new Date();
  const dateObj = date instanceof Date ? date : new Date(date);
  
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Verifica si una fecha está en el pasado
 * @param {string|Date} date - Fecha a verificar
 * @returns {boolean} true si la fecha está en el pasado
 */
export const isPastDate = (date) => {
  const now = new Date();
  const dateObj = date instanceof Date ? date : new Date(date);
  
  return dateObj < now;
};

/**
 * Verifica si una fecha está en el futuro
 * @param {string|Date} date - Fecha a verificar
 * @returns {boolean} true si la fecha está en el futuro
 */
export const isFutureDate = (date) => {
  const now = new Date();
  const dateObj = date instanceof Date ? date : new Date(date);
  
  return dateObj > now;
};

/**
 * Obtiene el rango de fechas en formato legible (ej: "10-15 de Enero, 2023")
 * @param {string|Date} startDate - Fecha de inicio
 * @param {string|Date} endDate - Fecha de fin
 * @param {string} locale - Configuración regional (por defecto: 'es-ES')
 * @returns {string} Rango de fechas formateado
 */
export const formatDateRange = (startDate, endDate, locale = 'es-ES') => {
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);
  
  // Si están en el mismo mes y año
  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    const monthYear = new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric'
    }).format(start);
    
    return `${start.getDate()}-${end.getDate()} de ${monthYear}`;
  }
  
  // Si están en el mismo año pero diferente mes
  if (start.getFullYear() === end.getFullYear()) {
    const startMonth = new Intl.DateTimeFormat(locale, { month: 'long' }).format(start);
    const endMonthYear = new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric'
    }).format(end);
    
    return `${start.getDate()} de ${startMonth} - ${end.getDate()} de ${endMonthYear}`;
  }
  
  // Si están en diferentes años
  const startFormatted = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(start);
  
  const endFormatted = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(end);
  
  return `${startFormatted} - ${endFormatted}`;
};

/**
 * Añade días a una fecha
 * @param {string|Date} date - Fecha base
 * @param {number} days - Número de días a añadir
 * @returns {Date} Nueva fecha con los días añadidos
 */
export const addDays = (date, days) => {
  const dateObj = date instanceof Date ? new Date(date) : new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
};

/**
 * Obtiene el nombre del mes
 * @param {number} monthIndex - Índice del mes (0-11)
 * @param {string} locale - Configuración regional (por defecto: 'es-ES')
 * @param {string} format - Formato ('long' o 'short')
 * @returns {string} Nombre del mes
 */
export const getMonthName = (monthIndex, locale = 'es-ES', format = 'long') => {
  const date = new Date();
  date.setMonth(monthIndex);
  
  return date.toLocaleDateString(locale, { month: format });
};

/**
 * Obtiene el nombre del día de la semana
 * @param {number} dayIndex - Índice del día (0-6, donde 0 es domingo)
 * @param {string} locale - Configuración regional (por defecto: 'es-ES')
 * @param {string} format - Formato ('long' o 'short')
 * @returns {string} Nombre del día
 */
export const getDayName = (dayIndex, locale = 'es-ES', format = 'long') => {
  const date = new Date();
  date.setDate(date.getDate() - date.getDay() + dayIndex);
  
  return date.toLocaleDateString(locale, { weekday: format });
};

/**
 * Formatea una duración en minutos a formato legible
 * @param {number} minutes - Duración en minutos
 * @returns {string} Duración formateada (ej: "2h 30m")
 */
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

/**
 * Agrupa un array de objetos por año y mes
 * @param {Array} items - Array de objetos con una propiedad de fecha
 * @param {string} dateField - Nombre del campo que contiene la fecha
 * @returns {Object} Objeto agrupado por año y mes
 */
export const groupByYearMonth = (items, dateField = 'date') => {
  const grouped = {};
  
  items.forEach(item => {
    const date = new Date(item[dateField]);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    if (!grouped[year]) {
      grouped[year] = {};
    }
    
    if (!grouped[year][month]) {
      grouped[year][month] = [];
    }
    
    grouped[year][month].push(item);
  });
  
  return grouped;
};

// Exportar todas las funciones como objeto por defecto
export default {
  formatDate,
  getCurrentDate,
  getDateOnly,
  daysBetweenDates,
  isToday,
  isPastDate,
  isFutureDate,
  formatDateRange,
  addDays,
  getMonthName,
  getDayName,
  formatDuration,
  groupByYearMonth
};
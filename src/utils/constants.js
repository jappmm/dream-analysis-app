// src/utils/constants.js

// Rutas de la API base
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Claves para almacenamiento local
export const STORAGE_KEYS = {
  USER: 'dream_analysis_user',
  TOKEN: 'dream_analysis_token',
  REMEMBER: 'dream_analysis_remember',
};

// Colores por categoría de insight (puedes usarlos en badges o gráficas)
export const CATEGORY_COLORS = {
  emoción: 'pink',
  símbolo: 'blue',
  acción: 'green',
  lugar: 'yellow',
  persona: 'purple',
};

const fs = require('fs');
const path = require('path');

// Cargar el prompt para el análisis de sueños
const promptPath = path.join(__dirname, '../../ai-prompt/dreamAnalysisPrompt.md');
let DREAM_ANALYSIS_PROMPT = '';

try {
  DREAM_ANALYSIS_PROMPT = fs.readFileSync(promptPath, 'utf8');
} catch (error) {
  console.error(`Error al cargar el prompt de análisis de sueños: ${error.message}`);
  DREAM_ANALYSIS_PROMPT = 'Analiza este sueño y proporciona una interpretación detallada de sus símbolos, emociones y posibles significados.';
}

// Configuraciones para diferentes modelos de IA
const AI_CONFIG = {
  openai: {
    model: process.env.AI_MODEL || 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0
  },
  anthropic: {
    model: 'claude-2',
    temperature: 0.7,
    maxTokens: 2000
  }
};

// Seleccionar el proveedor de IA según la configuración
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai';

module.exports = {
  DREAM_ANALYSIS_PROMPT,
  AI_CONFIG,
  AI_PROVIDER
};
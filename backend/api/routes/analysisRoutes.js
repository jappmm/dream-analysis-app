const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const analysisController = require('../controllers/analysisController');

// Rutas para obtener insights
router.get('/insights', protect, analysisController.getInsights);

// Rutas principales
router.get('/', protect, analysisController.getMyAnalyses);
router.get('/:dreamId', protect, analysisController.getAnalysis);
router.post('/:dreamId/regenerate', protect, analysisController.regenerateAnalysis);

module.exports = router;
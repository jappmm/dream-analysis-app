const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const dreamController = require('../controllers/dreamController');

// Rutas para estadísticas y símbolos
router.get('/stats', protect, dreamController.getDreamStats);
router.get('/symbols', protect, dreamController.getSymbols);

// Rutas CRUD principales
router
  .route('/')
  .get(protect, dreamController.getDreams)
  .post(protect, dreamController.createDream);

router
  .route('/:id')
  .get(protect, dreamController.getDream)
  .put(protect, dreamController.updateDream)
  .delete(protect, dreamController.deleteDream);

// Ruta para feedback de análisis
router.post('/:id/feedback', protect, dreamController.saveFeedback);

module.exports = router;
const express = require('express');
const { analyzeDream } = require('../controllers/analysisController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, analyzeDream);

module.exports = router;

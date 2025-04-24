const express = require('express');
const {
  getDreams,
  getDreamById,
  createDream,
  updateDream,
  deleteDream
} = require('../controllers/dreamController');
const authMiddleware = require('./authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.route('/')
  .get(getDreams)
  .post(createDream);

router.route('/:id')
  .get(getDreamById)
  .put(updateDream)
  .delete(deleteDream);

module.exports = router;
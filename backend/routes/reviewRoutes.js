const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Ruta para añadir una reseña
router.post('/reviews', reviewController.addReview);

module.exports = router;

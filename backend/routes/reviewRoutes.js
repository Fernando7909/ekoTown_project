const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Ruta para añadir una reseña
router.post('/reviews', reviewController.addReview);

// Endpoint para obtener el resumen de calificaciones
router.get('/ratings-summary/:storeId', reviewController.getRatingsSummary);

// Endpoint para verificar si un usuario ya ha hecho una reseña
router.get('/check-review/:storeId/:userId', reviewController.checkUserReview);


module.exports = router;

const Review = require('../models/reviewModel');
const Store = require('../models/storeModel'); // Si usas esta lógica

exports.addReview = (req, res) => {
  const { store_id, user_id, rating, comment } = req.body;

  // Validar datos de entrada
  if (!store_id || !user_id || !rating) {
    return res.status(400).json({ error: 'Faltan datos requeridos (store_id, user_id o rating).' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'El rating debe estar entre 1 y 5.' });
  }

  // Verificar si el usuario ya ha dejado una reseña para esta tienda
  Review.checkUserReview(store_id, user_id, (err, alreadyReviewed) => {
    if (err) {
      console.error('Error al verificar reseña del usuario:', err);
      return res.status(500).json({ error: 'Ocurrió un error al verificar la reseña del usuario.' });
    }

    if (alreadyReviewed) {
      return res.status(400).json({ error: 'Ya has dejado una reseña para esta tienda.' });
    }

    // Crear la nueva reseña
    Review.createReview(store_id, user_id, rating, comment || null, (err, reviewId) => {
      if (err) {
        console.error('Error al crear la reseña:', err);
        return res.status(500).json({ error: 'Ocurrió un error al añadir la reseña.' });
      }

      // Calcular el promedio de rating actualizado
      Review.getAverageRating(store_id, (err, averageRating) => {
        if (err) {
          console.error('Error al obtener el promedio de rating:', err);
          return res.status(500).json({ error: 'Ocurrió un error al calcular el promedio de rating.' });
        }

        // Actualizar el rating promedio de la tienda
        Store.updateStoreRating(store_id, averageRating, (err) => {
          if (err) {
            console.error('Error al actualizar el rating promedio de la tienda:', err);
            return res.status(500).json({ error: 'Ocurrió un error al actualizar el rating promedio.' });
          }

          // Respuesta exitosa
          res.status(201).json({
            message: 'Reseña añadida correctamente.',
            reviewId,
            averageRating,
          });
        });
      });
    });
  });
};

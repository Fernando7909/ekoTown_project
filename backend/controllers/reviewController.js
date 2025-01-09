const Review = require('../models/reviewModel');
const Store = require('../models/storeModel'); // Si usas esta lógica
const User = require('../models/userModel');

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

exports.getRatingsSummary = (req, res) => {
  const storeId = req.params.storeId;

  if (!storeId) {
    return res.status(400).json({ error: 'El ID de la tienda es obligatorio.' });
  }

  Review.getRatingsSummary(storeId, (err, summary) => {
    if (err) {
      console.error('Error al obtener el resumen de calificaciones:', err);
      return res.status(500).json({ error: 'Error al obtener el resumen de calificaciones.' });
    }

    if (!summary) {
      return res.status(404).json({ error: 'No se encontró un resumen de calificaciones para esta tienda.' });
    }

    res.status(200).json(summary);
  });
};

// Nueva función para verificar si un usuario ya hizo una reseña
exports.checkUserReview = (req, res) => {
  const { storeId, userId } = req.params;

  if (!storeId || !userId) {
    return res.status(400).json({ error: 'Se requiere el ID de la tienda y el ID del usuario.' });
  }

  Review.checkUserReview(storeId, userId, (err, alreadyReviewed) => {
    if (err) {
      console.error('Error al verificar la reseña del usuario:', err);
      return res.status(500).json({ error: 'Ocurrió un error al verificar la reseña.' });
    }

    res.status(200).json({ alreadyReviewed });
  });
};




exports.getStoreReviews = (req, res) => {
  const storeId = req.params.storeId;

  if (!storeId) {
      return res.status(400).json({ error: 'El ID de la tienda es obligatorio.' });
  }

  Review.getStoreReviews(storeId, (err, reviews) => {
      if (err) {
          console.error('Error al obtener las reseñas de la tienda:', err);
          return res.status(500).json({ error: 'Error al obtener las reseñas de la tienda.' });
      }

      if (!reviews || reviews.length === 0) {
          return res.status(404).json({ error: 'No hay reseñas para esta tienda.' });
      }

      // Enriquecer las reseñas con la información del usuario
      const enrichedReviews = reviews.map(review => ({
          id: review.id,
          user: {
              name: review.user_name,
              lastName: review.user_lastName,
          },
          rating: review.rating,
          comment: review.comment || '',
          date: review.created_at, // Ahora la fecha ya está formateada
      }));

      res.status(200).json(enrichedReviews);
  });
};



const db = require('../config/db'); // Asegúrate de que esta referencia sea correcta

// Crear una nueva reseña
exports.createReview = (storeId, userId, rating, comment, callback) => {
  db.query(
    'INSERT INTO reviews (store_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
    [storeId, userId, rating, comment],
    (err, result) => {
      if (err) {
        console.error('Error al crear la reseña:', err);
        return callback(err, null);
      }
      callback(null, result.insertId);
    }
  );
};

// Obtener el promedio de rating de una tienda
exports.getAverageRating = (storeId, callback) => {
  db.query(
    'SELECT AVG(rating) as averageRating FROM reviews WHERE store_id = ?',
    [storeId],
    (err, rows) => {
      if (err) {
        console.error('Error al obtener el promedio de rating:', err);
        return callback(err, null);
      }
      callback(null, rows[0]?.averageRating || 0);
    }
  );
};

// Verificar si un usuario ya dejó una reseña para una tienda
exports.checkUserReview = (storeId, userId, callback) => {
  db.query(
    'SELECT * FROM reviews WHERE store_id = ? AND user_id = ?',
    [storeId, userId],
    (err, rows) => {
      if (err) {
        console.error('Error al verificar reseña del usuario:', err);
        return callback(err, null);
      }
      callback(null, rows.length > 0);
    }
  );
};

// Actualizar el rating promedio de una tienda
exports.updateStoreRating = (storeId, averageRating, callback) => {
  db.query(
    'UPDATE stores SET rating = ? WHERE id = ?',
    [averageRating, storeId],
    (err, result) => {
      if (err) {
        console.error('Error al actualizar el rating de la tienda:', err);
        return callback(err, null);
      }
      callback(null, result);
    }
  );
};


const db = require('../config/db');

// Crear una tienda asociada a un Business Manager
exports.createStore = (storeData, callback) => {
  console.log('Datos recibidos para crear comercio en el modelo:', storeData);

  // Validar que los campos obligatorios estén presentes
  if (!storeData.nombre_comercio || !storeData.nombre_gerente || !storeData.descripcion) {
    const error = new Error('Campos obligatorios faltantes');
    console.error(error.message);
    return callback(error);
  }

  const query = `
    INSERT INTO stores (id, nombre_comercio, foto_gerente, nombre_gerente, imagen, descripcion, rating)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    storeData.id, // ID del Business Manager
    storeData.nombre_comercio,
    storeData.foto_gerente || null, // Permitir valores nulos para columnas opcionales
    storeData.nombre_gerente,
    storeData.imagen || null,       // Permitir valores nulos para columnas opcionales
    storeData.descripcion,
    storeData.rating || 0,          // Valor por defecto para rating
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al crear el comercio:', err.message, err.stack);
      return callback(err);
    }
    console.log('Comercio creado exitosamente con ID:', result.insertId);
    callback(null, result);
  });
};


// Obtener todas las tiendas con el conteo de reseñas
exports.getAllStores = (callback) => {
  console.log('Recuperando todos los comercios de la base de datos con el conteo de reseñas');
  const query = `
    SELECT 
      stores.id, 
      stores.nombre_comercio, 
      stores.foto_gerente, 
      stores.nombre_gerente, 
      stores.imagen, 
      stores.descripcion, 
      stores.rating, 
      COUNT(reviews.id) AS reviewsCount
    FROM 
      stores 
    LEFT JOIN 
      reviews ON stores.id = reviews.store_id
    GROUP BY 
      stores.id
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener comercios con el conteo de reseñas:', err.message, err.stack);
      return callback(err);
    }
    console.log('Comercios recuperados con reviewsCount:', results);
    callback(null, results);
  });
};


// Obtener una tienda por el ID del Business Manager
exports.getStoreByBusinessManager = (businessManagerId, callback) => {
  const query = 'SELECT * FROM stores WHERE id = ? LIMIT 1';
  db.query(query, [businessManagerId], (err, results) => {
    if (err) {
      console.error('Error al obtener la tienda:', err.message);
      return callback(err, null);
    }
    callback(null, results[0]); // Devuelve la primera tienda encontrada
  });
};


// Actualizar tienda
exports.updateStore = (storeData, callback) => {
  const query = `
    UPDATE stores 
    SET nombre_comercio = ?, foto_gerente = ?, nombre_gerente = ?, imagen = ?, descripcion = ?
    WHERE id = ?
  `;
  const values = [
    storeData.nombre_comercio,
    storeData.foto_gerente || null,
    storeData.nombre_gerente,
    storeData.imagen || null,
    storeData.descripcion,
    // storeData.rating || 0,
    storeData.id,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al actualizar la tienda:', err.message, err.stack);
      return callback(err);
    }
    callback(null, result);
  });
};



// Eliminar una tienda por su ID
exports.deleteStoreById = (storeId, callback) => {
  const query = 'DELETE FROM stores WHERE id = ?';
  db.query(query, [storeId], (err, result) => {
    if (err) {
      console.error('Error al eliminar la tienda:', err.message);
      return callback(err, null);
    }
    callback(null, result);
  });
};



// Obtener productos publicados de una tienda
exports.getPublishedProductsByStore = (storeId, callback) => {
  console.log(`Iniciando búsqueda de productos publicados para la tienda con ID: ${storeId}`);

  // Validar que el storeId sea un número válido
  if (!storeId || isNaN(storeId)) {
    const error = new Error('ID de tienda inválido o no proporcionado');
    console.error(error.message);
    return callback(error, null);
  }

  const query = `
    SELECT * FROM productos 
    WHERE business_manager_id = ? AND publicado = true
  `;
  console.log('Consulta SQL ejecutada:', query, 'con ID:', storeId);

  db.query(query, [storeId], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta SQL:', err.message);
      return callback(err, null);
    }

    // Verificar si se obtuvieron resultados
    if (results.length === 0) {
      console.warn(`No se encontraron productos publicados para la tienda con ID: ${storeId}`);
    } else {
      console.log(`Productos publicados recuperados para la tienda con ID: ${storeId}:`, results);
    }

    callback(null, results);
  });
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










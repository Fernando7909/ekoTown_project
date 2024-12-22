const db = require('../config/db');

exports.createStore = (storeData, callback) => {
  console.log('Datos recibidos para crear comercio en el modelo:', storeData);

  // Validar que los campos obligatorios estén presentes
  if (!storeData.nombre_comercio || !storeData.nombre_gerente || !storeData.descripcion) {
    const error = new Error('Campos obligatorios faltantes');
    console.error(error.message);
    return callback(error);
  }

  const query = `
    INSERT INTO stores (nombre_comercio, foto_gerente, nombre_gerente, imagen, descripcion, rating)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
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

exports.getAllStores = (callback) => {
  console.log('Recuperando todos los comercios de la base de datos');
  const query = 'SELECT * FROM stores';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener comercios:', err.message, err.stack);
      return callback(err);
    }
    console.log('Comercios recuperados:', results);
    callback(null, results);
  });
};

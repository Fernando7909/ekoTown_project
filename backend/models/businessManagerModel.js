const db = require('../config/db');

// Crear Business Manager
exports.createBusinessManager = (managerData, callback) => {
  console.log('Iniciando registro de Business Manager con datos:', managerData);

  const query = `
    INSERT INTO business_managers (name, last_name, dni, email, address, password)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    managerData.name,
    managerData.last_name,
    managerData.dni,
    managerData.email,
    managerData.address,
    managerData.password, // Almacenar directamente la contraseña sin encriptar
  ];

  console.log('Ejecutando consulta SQL para registrar el Business Manager.');
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al insertar Business Manager en la base de datos:', err);
      return callback(err);
    }
    console.log('Registro de Business Manager exitoso. ID:', result.insertId);
    callback(null, result);
  });
};

// Buscar Business Manager por email
exports.findBusinessManagerByEmail = (email, callback) => {
  console.log('Buscando Business Manager por email:', email);
  const query = 'SELECT * FROM business_managers WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error al buscar Business Manager por email:', err);
      return callback(err);
    }
    if (results.length === 0) {
      console.warn('No se encontró un Business Manager con el email:', email);
      return callback('Business Manager no encontrado');
    }
    console.log('Business Manager encontrado:', results[0]);
    callback(null, results[0]);
  });
};

// Actualizar Business Manager por ID
exports.updateBusinessManagerById = (id, updatedData, callback) => {
  console.log('Iniciando actualización de Business Manager con ID:', id);
  console.log('Datos para actualizar:', updatedData);

  const query = `
    UPDATE business_managers
    SET name = ?, last_name = ?, email = ?, dni = ?, address = ?
    WHERE id = ?
  `;
  const values = [
    updatedData.name,
    updatedData.last_name,
    updatedData.email,
    updatedData.dni,   
    updatedData.address, 
    id,
  ];

  console.log('Ejecutando consulta SQL para actualizar el Business Manager.');
  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al actualizar el Business Manager:', err);
      return callback(err);
    }
    console.log('Actualización de Business Manager exitosa. Filas afectadas:', result.affectedRows);
    callback(null, result);
  });
};


// Eliminar Business Manager por ID
exports.deleteBusinessManagerById = (id, callback) => {
  console.log('Iniciando eliminación de Business Manager con ID:', id);
  const query = 'DELETE FROM business_managers WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el Business Manager:', err);
      return callback(err);
    }
    console.log('Eliminación de Business Manager exitosa. Filas afectadas:', result.affectedRows);
    callback(null, result);
  });
};

// Actualizar la imagen de perfil del Business Manager
exports.updateProfileImage = (id, imagePath, callback) => {
  console.log('Iniciando actualización de imagen de perfil para Business Manager con ID:', id);
  console.log('Ruta de la nueva imagen de perfil:', imagePath);

  const query = 'UPDATE business_managers SET profile_image = ? WHERE id = ?';
  db.query(query, [imagePath, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar la imagen de perfil:', err);
      return callback(err);
    }
    console.log('Imagen de perfil actualizada exitosamente. Filas afectadas:', result.affectedRows);
    callback(null, result);
  });
};


// función para obtener los datos del Business Manager por ID:
exports.findBusinessManagerById = (id, callback) => {
  console.log('Buscando Business Manager por ID:', id);
  const query = 'SELECT name, last_name, dni, email, address, profile_image FROM business_managers WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al buscar Business Manager por ID:', err);
      return callback(err);
    }
    if (results.length === 0) {
      console.warn('No se encontró un Business Manager con el ID:', id);
      return callback('Business Manager no encontrado');
    }
    console.log('Business Manager encontrado:', results[0]);
    callback(null, results[0]);
  });
};



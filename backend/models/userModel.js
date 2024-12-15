const db = require('../config/db');

// Crear usuario
exports.createUser = (userData, callback) => {
  const query = 'INSERT INTO users (name, last_name, email, password) VALUES (?, ?, ?, ?)';
  db.query(query, [userData.name, userData.last_name, userData.email, userData.password], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return callback('El correo ya está registrado.');
      }
      return callback('Error al crear el usuario.');
    }
    callback(null, result);
  });
}  

// Buscar usuario por email
exports.findUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err || results.length === 0) {
      return callback('Usuario no encontrado');
    }
    console.log('Resultado de la consulta:', results[0]);
    callback(null, results[0]);
  });
};

// Eliminar usuario por ID
exports.deleteUserById = (id, callback) => {
  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [id], callback);
};

// Actualizar usuario por ID
exports.updateUserById = (id, updatedData, callback) => {
  const query = 'UPDATE users SET name = ?, last_name = ?, email = ? WHERE id = ?';
  db.query(
    query,
    [updatedData.name, updatedData.last_name, updatedData.email, id],
    (err, result) => {
      if (err) {
        console.error('Error al actualizar el usuario:', err);
        return callback(err);
      }
      console.log('Usuario actualizado correctamente:', result);
      callback(null, result);
    }
  );
};

// Actualizar la imagen de perfil del usuario por ID
exports.updateProfileImage = (id, imagePath, callback) => {
  const query = 'UPDATE users SET profile_image = ? WHERE id = ?';
  db.query(query, [imagePath, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar la imagen de perfil:', err);
      return callback(err);
    }
    console.log('Imagen de perfil actualizada correctamente:', result);
    callback(null, result);
  });
};


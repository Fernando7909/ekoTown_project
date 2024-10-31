const db = require('../config/db');

// Crear usuario
exports.createUser = (userData, callback) => {
  const query = 'INSERT INTO users (name, last_name, email, password) VALUES (?, ?, ?, ?)';
  db.query(query, [userData.name, userData.last_name, userData.email, userData.password], callback);
};

// Buscar usuario por email
exports.findUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err || results.length === 0) {
      return callback('Usuario no encontrado');
    }
    callback(null, results[0]);
  });
};

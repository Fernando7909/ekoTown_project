const db = require('../config/db');
const bcrypt = require('bcrypt');

// Crear Business Manager
exports.createBusinessManager = (managerData, callback) => {
  // Hashear la contraseña antes de guardar
  bcrypt.hash(managerData.password, 10, (err, hashedPassword) => {
    if (err) return callback(err);

    // Definir la consulta SQL para insertar el Business Manager
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
      hashedPassword
    ];

    // Ejecutar la consulta en la base de datos
    db.query(query, values, callback);
  });
};

// Buscar Business Manager por email
exports.findBusinessManagerByEmail = (email, callback) => {
  const query = 'SELECT * FROM business_managers WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err || results.length === 0) {
      return callback('Business Manager no encontrado');
    }
    callback(null, results[0]);
  });
};

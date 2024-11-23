const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Registrar usuario
exports.register = (req, res) => {
  const { name, last_name, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Error al encriptar la contraseña' });
    }

    User.createUser({ name, last_name, email, password: hashedPassword }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error al registrar el usuario' });
      }
      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    });
  });
};


// Inicio de sesión
exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByEmail(email, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
      }

      // Generar el token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Responder con el token y el nombre del usuario
      res.json({
        message: 'Inicio de sesión exitoso',
        token,
        name: user.name, // Incluir el nombre del usuario
        last_name: user.last_name, // Incluir el apellido del usuario (opcional)
      });
    });
  });
};


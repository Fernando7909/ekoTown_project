const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BusinessManager = require('../models/businessManagerModel');

// Registrar Business Manager
exports.register = (req, res) => {
  const { name, last_name, dni, email, address, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Error al encriptar la contraseña' });
    }

    BusinessManager.createBusinessManager(
      { name, last_name, dni, email, address, password: hashedPassword },
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Error al registrar el Business Manager' });
        }
        res.status(201).json({ message: 'Business Manager registrado exitosamente' });
      }
    );
  });
};

// Inicio de sesión de Business Manager
exports.login = (req, res) => {
  const { email, password } = req.body;

  BusinessManager.findBusinessManagerByEmail(email, (err, manager) => {
    if (err || !manager) {
      return res.status(400).json({ error: 'Business Manager no encontrado' });
    }

    bcrypt.compare(password, manager.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
      }

      const token = jwt.sign({ managerId: manager.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Inicio de sesión exitoso', token });
    });
  });
};

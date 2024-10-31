const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para el registro de usuarios
router.post('/register', userController.register);

// Ruta para el inicio de sesión
router.post('/login', userController.login);

module.exports = router;

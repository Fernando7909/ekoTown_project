const express = require('express');
const router = express.Router();
const businessManagerController = require('../controllers/businessManagerController');

// Ruta para el registro de Business Managers
router.post('/register', businessManagerController.register);

// Ruta para el inicio de sesión de Business Managers
router.post('/login', businessManagerController.login);

module.exports = router;

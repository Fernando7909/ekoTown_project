const express = require('express');
const router = express.Router();
const businessManagerController = require('../controllers/businessManagerController');

// Ruta para el registro de Business Managers
router.post('/register', businessManagerController.register);

// Ruta para el inicio de sesión de Business Managers
router.post('/login', businessManagerController.login);

// Ruta para eliminar un Business Manager
router.delete('/delete/:id', businessManagerController.deleteBm);

// Ruta para actualizar un Business Manager
router.put('/update/:id', businessManagerController.updateBm);

// Ruta para subir la imagen de perfil de un Business Manager
router.post('/uploadProfileImage', businessManagerController.uploadProfileImage);

module.exports = router;

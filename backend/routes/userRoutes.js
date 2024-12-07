const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para el registro de usuarios
router.post('/register', userController.register);

// Ruta para el inicio de sesión
router.post('/login', userController.login);

// Ruta para eliminar el usuario
router.delete('/delete/:id', userController.deleteUser);

// Ruta para actualizar el perfil del usuario
router.put('/update/:id', userController.updateUser); // Nueva ruta para actualizar usuario

// Ruta para manejar la subida de imagenes
router.post('/uploadProfileImage', userController.uploadProfileImage);


module.exports = router;

const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Rutas públicas
router.get('/', blogController.getAllBlogs); // Obtener todos los blogs
router.get('/category/:category', blogController.getBlogsByCategory); // Filtrar blogs por categoría
router.get('/:id', blogController.getBlogById); // Obtener un blog por ID

// Rutas protegidas (basadas en businessManagerId en el cuerpo)
router.post('/', blogController.createBlog); // Crear un blog
router.put('/:id', blogController.updateBlog); // Actualizar un blog
router.delete('/:id', blogController.deleteBlog); // Eliminar un blog

router.get('/businessManager/:businessManagerId', blogController.getBlogsByBusinessManagerId);

module.exports = router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController'); // Importamos el controlador
const router = express.Router();

// Configuración de multer para guardar las imágenes en la carpeta uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); // Carpeta donde se guardan las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para cada archivo
  }
});

const upload = multer({ storage });

// Rutas de productos
// Crear un producto con subida de imagen
router.post('/', upload.single('imagen'), productController.createProduct);

// Obtener todos los productos
router.get('/', productController.getAllProducts);

// Obtener productos por Business Manager
router.get('/:business_manager_id', productController.getProductsByBusinessManager);

// Actualizar un producto con posible cambio de imagen
router.put('/:id', upload.single('imagen'), productController.updateProduct);

// Eliminar un producto
router.delete('/:id', productController.deleteProduct);

module.exports = router;

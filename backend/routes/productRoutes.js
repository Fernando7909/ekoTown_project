const express = require('express');
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');
const fs = require('fs');
const router = express.Router();

// Validar que la carpeta 'uploads' exista
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Validación de tipos de archivo
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPEG, JPG y PNG.'));
        }
    }
});

// Middleware para manejar errores de Multer
const handleMulterErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Error al subir archivo: ${err.message}` });
    } else if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
};

// Rutas de productos
router.post('/', upload.single('imagen'), handleMulterErrors, productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:business_manager_id', productController.getProductsByBusinessManager);
router.put('/:id', upload.single('imagen'), handleMulterErrors, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.post('/process-purchase', productController.processPurchase);

module.exports = router;

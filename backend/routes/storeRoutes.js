const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

router.post('/create', storeController.createStore);
router.get('/all', storeController.getAllStores);

// ruta para verificar si el Business Manager tiene una tienda
router.get('/:businessManagerId', storeController.getStoreByBusinessManager);

// Ruta para eliminar una tienda
router.delete('/delete/:id', storeController.deleteStore);

// Ruta para editar la tienda
router.put('/update/:id', storeController.updateStore);

module.exports = router;


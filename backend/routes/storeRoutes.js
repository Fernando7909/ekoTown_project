const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

router.post('/create', storeController.createStore);
router.get('/all', storeController.getAllStores);

module.exports = router;


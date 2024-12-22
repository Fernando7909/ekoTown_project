const multer = require('multer');
const path = require('path');
const Store = require('../models/storeModel');

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Nombre único
  },
});

const upload = multer({ storage: storage });

// Crear Store con manejo de imágenes
exports.createStore = [
  upload.fields([
    { name: 'foto_gerente', maxCount: 1 },
    { name: 'imagen', maxCount: 1 },
  ]),
  (req, res) => {
    console.log('Datos recibidos para crear comercio:', req.body);

    // Validar campos obligatorios
    if (!req.body.nombre_comercio || !req.body.nombre_gerente || !req.body.descripcion) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const storeData = {
      nombre_comercio: req.body.nombre_comercio,
      foto_gerente: req.files['foto_gerente'] ? req.files['foto_gerente'][0].filename : null,
      nombre_gerente: req.body.nombre_gerente,
      imagen: req.files['imagen'] ? req.files['imagen'][0].filename : null,
      descripcion: req.body.descripcion,
      rating: req.body.rating || 0, // Valor por defecto
    };

    Store.createStore(storeData, (err, result) => {
      if (err) {
        console.error('Error al crear el comercio:', err);
        return res.status(500).json({ error: 'Error al crear el comercio' });
      }
      res.status(201).json({ message: 'Comercio creado exitosamente', storeId: result.insertId });
    });
  },
];

// Obtener todos los Stores
exports.getAllStores = (req, res) => {
  Store.getAllStores((err, stores) => {
    if (err) {
      console.error('Error al obtener los comercios:', err);
      return res.status(500).json({ error: 'Error al obtener comercios' });
    }

    // Agregar la URL completa para los archivos antes de enviar al cliente
    const storesWithImagePaths = stores.map((store) => ({
      ...store,
      foto_gerente: store.foto_gerente ? `http://localhost:3000/uploads/${store.foto_gerente}` : null,
      imagen: store.imagen ? `http://localhost:3000/uploads/${store.imagen}` : null,
    }));

    console.log('Comercios enviados al frontend:', storesWithImagePaths); // DEBUG
    res.status(200).json(storesWithImagePaths);
  });
};


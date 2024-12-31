const multer = require('multer');
const path = require('path');
const Store = require('../models/storeModel');

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPG, JPEG y PNG.'));
    }
  },
});

// Middleware de manejo de errores para Multer
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Error de subida: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Crear Store asegurando que el ID sea único por Business Manager
exports.createStore = [
  upload.fields([
    { name: 'foto_gerente', maxCount: 1 },
    { name: 'imagen', maxCount: 1 },
  ]),
  handleMulterErrors, // Manejar errores de subida
  (req, res) => {
    const businessManagerId = req.body.businessManagerId; // ID del Business Manager

    // Validar que el ID del Business Manager esté presente
    if (!businessManagerId) {
      return res.status(400).json({ error: 'El ID del Business Manager es obligatorio' });
    }

    // Verificar si ya existe una tienda asociada al Business Manager
    Store.getStoreByBusinessManager(businessManagerId, (err, existingStore) => {
      if (err) {
        console.error('Error al verificar la existencia de la tienda:', err);
        return res.status(500).json({ error: 'Error al verificar la existencia de la tienda' });
      }

      if (existingStore) {
        return res.status(400).json({ error: 'Ya existe una tienda asociada a este Business Manager' });
      }

      // Crear los datos de la tienda si no existe
      const storeData = {
        id: businessManagerId, // Usar el mismo ID que el Business Manager
        nombre_comercio: req.body.nombre_comercio,
        foto_gerente: req.files['foto_gerente'] ? req.files['foto_gerente'][0].filename : null,
        nombre_gerente: req.body.nombre_gerente,
        imagen: req.files['imagen'] ? req.files['imagen'][0].filename : null,
        descripcion: req.body.descripcion,
        rating: req.body.rating || 0, // Valor por defecto
      };

      // Crear la tienda en la base de datos
      Store.createStore(storeData, (err, result) => {
        if (err) {
          console.error('Error al crear el comercio:', err);
          return res.status(500).json({ error: 'Error al crear el comercio' });
        }
        res.status(201).json({ message: 'Comercio creado exitosamente', storeId: result.insertId });
      });
    });
  },
];


// Obtener todos los Stores
exports.getAllStores = (req, res) => {
  Store.getAllStores((err, stores) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener comercios' });
    }

    const storesWithImagePaths = stores.map((store) => ({
      ...store,
      foto_gerente: store.foto_gerente
        ? `http://localhost:3000/uploads/${store.foto_gerente}`.replace(/\\/g, '/')
        : null,
      imagen: store.imagen
        ? `http://localhost:3000/uploads/${store.imagen}`.replace(/\\/g, '/')
        : null,
    }));

    res.status(200).json(storesWithImagePaths);
  });
};

// Obtener la tienda asociada a un Business Manager
exports.getStoreByBusinessManager = (req, res) => {
  const businessManagerId = req.params.businessManagerId;

  Store.getStoreByBusinessManager(businessManagerId, (err, store) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener la tienda' });
    }

    if (!store) {
      return res.status(404).json({ message: 'No se encontró una tienda para este Business Manager' });
    }

    // Ajustar las rutas completas para las imágenes
    store.foto_gerente = store.foto_gerente
      ? `http://localhost:3000/uploads/${store.foto_gerente}`.replace(/\\/g, '/')
      : null;
    store.imagen = store.imagen
      ? `http://localhost:3000/uploads/${store.imagen}`.replace(/\\/g, '/')
      : null;

    res.status(200).json({ store });
  });
};



// Eliminar tienda por Business Manager ID
exports.deleteStore = (req, res) => {
  const storeId = req.params.id;

  Store.deleteStoreById(storeId, (err, result) => {
      if (err) {
          console.error('Error al eliminar la tienda:', err);
          return res.status(500).json({ error: 'Error al eliminar la tienda', details: err.message });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Tienda no encontrada' });
      }

      res.status(200).json({ message: 'Tienda eliminada con éxito' });
  });
};


// Actualizar la tienda con soporte para archivos
exports.updateStore = [
  upload.fields([
    { name: 'foto_gerente', maxCount: 1 },
    { name: 'imagen', maxCount: 1 },
  ]),
  (req, res) => {
    const storeId = req.params.id;

    // Validar si el ID está presente
    console.log('ID recibido para actualización:', storeId);
    if (!storeId) {
      console.error('Error: No se proporcionó un ID para la tienda.');
      return res.status(400).json({ error: 'El ID de la tienda es obligatorio' });
    }

    // Preparar datos de actualización
    console.log('Cuerpo recibido:', req.body);
    const updatedData = {
      nombre_comercio: req.body.nombre_comercio,
      nombre_gerente: req.body.nombre_gerente,
      descripcion: req.body.descripcion,
      rating: req.body.rating || 0,
    };

    // Manejar las imágenes
    console.log('Archivos subidos:', req.files);
    updatedData.foto_gerente = req.files['foto_gerente']
      ? req.files['foto_gerente'][0].filename
      : req.body.foto_gerente_actual; // Usar imagen actual si no se subió una nueva
    updatedData.imagen = req.files['imagen']
      ? req.files['imagen'][0].filename
      : req.body.imagen_actual; // Usar imagen actual si no se subió una nueva

    console.log('Datos preparados para actualización:', updatedData);

    // Llamar al modelo para actualizar la tienda
    Store.updateStore({ id: storeId, ...updatedData }, (err, result) => {
      if (err) {
        console.error('Error al actualizar la tienda:', err);
        return res.status(500).json({ error: 'Error al actualizar la tienda' });
      }

      console.log('Resultado de la actualización:', result);

      if (result.affectedRows === 0) {
        console.warn('Advertencia: No se encontró la tienda con el ID proporcionado para actualizar.');
        return res.status(404).json({ message: 'No se encontró la tienda para actualizar' });
      }

      console.log('Actualización exitosa de la tienda con ID:', storeId);
      res.status(200).json({ message: 'Tienda actualizada exitosamente' });
    });
  },
];


// Obtener productos publicados por tienda
exports.getPublishedProductsByStore = (req, res) => {
  const storeId = req.params.storeId;

  console.log(`Obteniendo productos publicados para la tienda con ID: ${storeId}`); // Log del ID recibido

  // Validar si el storeId es válido
  if (!storeId) {
    console.error('Error: No se proporcionó un storeId válido.');
    return res.status(400).json({ error: 'El ID de la tienda es obligatorio.' });
  }

  Store.getPublishedProductsByStore(storeId, (err, products) => {
    if (err) {
      console.error('Error al obtener productos publicados:', err); // Log del error
      return res.status(500).json({ error: 'Error al obtener productos publicados.' });
    }

    // Log de los productos obtenidos
    console.log('Productos obtenidos desde la base de datos:', products);

    // Ajustar las rutas completas para las imágenes
    const productsWithImagePaths = products.map((product) => ({
      ...product,
      imagen_url: product.imagen_url
          ? `http://localhost:3000${product.imagen_url.replace(/\\/g, '/')}` // Sin concatenar extra `/uploads/`
          : null,
  }));
  
  

    // Log de los productos procesados
    console.log('Productos con rutas completas:', productsWithImagePaths);

    res.status(200).json(productsWithImagePaths);
  });
};




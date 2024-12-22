const jwt = require('jsonwebtoken');
const BusinessManager = require('../models/businessManagerModel');
const multer = require('multer');
const path = require('path');

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Nombre único para cada archivo
  },
});

const upload = multer({ storage: storage });

// Registrar Business Manager
exports.register = (req, res) => {
  const { name, last_name, dni, email, address, password } = req.body;

  // Validación básica
  if (!name || !last_name || !dni || !email || !address || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  console.log('Datos recibidos para registro:', { name, last_name, dni, email, address, password });

  BusinessManager.createBusinessManager(
    { name, last_name, dni, email, address, password },
    (err, result) => {
      if (err) {
        console.error('Error al registrar el Business Manager:', err);
        return res.status(500).json({ error: 'Error al registrar el Business Manager' });
      }
      console.log('Business Manager registrado con éxito:', { email, name });
      res.status(201).json({ message: 'Business Manager registrado exitosamente' });
    }
  );
};

// Inicio de sesión de Business Manager
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  console.log('Intento de inicio de sesión para email:', email);

  BusinessManager.findBusinessManagerByEmail(email, (err, manager) => {
    if (err || !manager) {
      console.error('Error: Business Manager no encontrado para email:', email);
      return res.status(400).json({ error: 'Business Manager no encontrado' });
    }
    console.log('Objeto completo del Business Manager:', manager);
    console.log('Contraseña almacenada en la base de datos:', manager.password);

    if (manager.password !== password) {
      console.error('Contraseña incorrecta para el email:', email);
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ managerId: manager.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Inicio de sesión exitoso para email:', email);

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      name: manager.name,
      last_name: manager.last_name,
      email: manager.email,
      profileImage: manager.profile_image || '',
      dni: manager.dni,           
      address: manager.address,    
    });
  });
};


// Eliminar Business Manager
exports.deleteBm = (req, res) => {
  const bmId = req.params.id; 
  console.log('ID recibido para eliminación:', bmId);

  BusinessManager.deleteBusinessManagerById(bmId, (err, result) => {
    if (err) {
      console.error('Error al eliminar Business Manager:', err);
      return res.status(500).json({ error: 'Error al eliminar el Business Manager' });
    }
    console.log('Resultado de la eliminación:', result);
    res.status(200).json({ message: 'Business Manager eliminado correctamente' });
  });
};

// Actualizar Business Manager
exports.updateBm = (req, res) => {
  const bmId = req.params.id; // ID del Business Manager a actualizar
  const { name, last_name, email, address, dni } = req.body; // Añadir DNI a los datos recibidos

  // Validación básica
  if (!name || !last_name || !email || !address || !dni) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios para la actualización' });
  }

  console.log('ID recibido para actualización:', bmId);
  console.log('Datos recibidos para actualización:', { name, last_name, email, address, dni });

  // Llamar al modelo para actualizar los datos
  BusinessManager.updateBusinessManagerById(
    bmId,
    { name, last_name, email, address, dni }, // Pasar todos los campos
    (err, result) => {
      if (err) {
        console.error('Error al actualizar Business Manager:', err);
        return res.status(500).json({ error: 'Error al actualizar el Business Manager' });
      }

      console.log('Resultado de la actualización:', result);
      res.status(200).json({ message: 'Business Manager actualizado correctamente' });
    }
  );
};


// Subir imagen de perfil para Business Manager
exports.uploadProfileImage = [
  upload.single('profileImage'), // Middleware de Multer para manejar un solo archivo
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
    }

    const bmId = req.body.bmId; // ID del Business Manager que subió la imagen
    const imagePath = req.file.path; // Ruta donde se guardó la imagen

    BusinessManager.updateProfileImage(bmId, imagePath, (err, result) => {
      if (err) {
        console.error('Error al guardar la ruta de la imagen:', err);
        return res.status(500).json({ error: 'Error al guardar la imagen de perfil' });
      }

      console.log('Imagen de perfil subida correctamente:', result);
      res.status(200).json({ message: 'Imagen de perfil subida correctamente', imagePath });
    });
  },
];

exports.findBusinessManagerByEmail = (email, callback) => {
  const query = 'SELECT * FROM business_managers WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err || results.length === 0) {
      console.error('Error o resultado vacío al buscar Business Manager por email:', email);
      return callback('Business Manager no encontrado');
    }
    console.log('Business Manager recuperado:', results[0]); // Log de los resultados
    callback(null, results[0]);
  });
};


// función para obtener los datos del Business Manager por ID:
exports.getBmById = (req, res) => {
  const bmId = req.params.id; // Obtener ID desde la URL
  console.log('ID recibido para obtener datos:', bmId);

  BusinessManager.findBusinessManagerById(bmId, (err, manager) => {
    if (err) {
      console.error('Error al recuperar Business Manager:', err);
      return res.status(500).json({ error: 'Error al obtener datos del Business Manager' });
    }
    res.status(200).json(manager);
  });
};


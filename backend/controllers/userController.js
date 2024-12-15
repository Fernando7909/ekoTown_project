const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
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

// Registrar usuario
exports.register = (req, res) => {
  const { name, last_name, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Error al encriptar la contraseña' });
    }

    User.createUser({ name, last_name, email, password: hashedPassword }, (err, result) => {
      if (err) {
        console.error('Error al registrar el usuario:', err);
        return res.status(500).json({ error: 'Error al registrar el usuario' });
      }
      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    });    
  });
};

// Inicio de sesión
exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByEmail(email, (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
      }

      // Generar el token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Responder con el token, nombre, apellido, email y profile_image
      res.json({
        message: 'Inicio de sesión exitoso',
        token,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        profileImage: user.profile_image || '', // Incluir la ruta de la imagen
      });
    });
  });
};


// Eliminar usuario
exports.deleteUser = (req, res) => {
  const userId = req.params.id; // ID del usuario a eliminar
  console.log('ID recibido para eliminación:', userId);

  User.deleteUserById(userId, (err, result) => {
    if (err) {
      console.error('Error al eliminar usuario:', err);
      return res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
    console.log('Resultado de la eliminación:', result);
    res.status(200).json({ message: 'Usuario eliminado correctamente' });
  });
};

// Actualizar usuario
exports.updateUser = (req, res) => {
  const userId = req.params.id; // ID del usuario a actualizar
  const { name, last_name, email } = req.body; // Nuevos datos del usuario

  console.log('ID recibido para actualización:', userId);
  console.log('Datos recibidos para actualización:', { name, last_name, email });

  User.updateUserById(userId, { name, last_name, email }, (err, result) => {
    if (err) {
      console.error('Error al actualizar usuario:', err);
      return res.status(500).json({ error: 'Error al actualizar el usuario' });
    }

    console.log('Resultado de la actualización:', result);
    res.status(200).json({ message: 'Usuario actualizado correctamente' });
  });
};

// Subir imagen de perfil
exports.uploadProfileImage = [
  upload.single('profileImage'), // Middleware de Multer para manejar un solo archivo
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ninguna imagen' });
    }

    const userId = req.body.userId; // ID del usuario que subió la imagen
    const imagePath = req.file.path; // Ruta donde se guardó la imagen

    // Actualiza la ruta de la imagen en la base de datos
    User.updateProfileImage(userId, imagePath, (err, result) => {
      if (err) {
        console.error('Error al guardar la ruta de la imagen:', err);
        return res.status(500).json({ error: 'Error al guardar la imagen de perfil' });
      }

      console.log('Imagen de perfil subida correctamente:', result);
      res.status(200).json({ message: 'Imagen de perfil subida correctamente', imagePath });
    });
  },
];

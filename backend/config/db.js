const mysql = require('mysql');

// Crear la conexión a MySQL utilizando variables de entorno
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',  // Dirección del servidor de base de datos
  user: process.env.DB_USER || 'root',       // Usuario de la base de datos
  password: process.env.DB_PASS || 'root',       // Contraseña de la base de datos
  database: process.env.DB_NAME || 'ekoTown_project',  // Nombre de la base de datos
  port: process.env.DB_PORT || 3306          // Puerto de conexión, el puerto por defecto de MySQL es 3306
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    process.exit(1);
  }
  console.log('Conectado a la base de datos MySQL');
});

module.exports = db;

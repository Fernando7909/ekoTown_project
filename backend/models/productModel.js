const db = require('../config/db'); // Conexión a la base de datos

const Product = {
  // Obtener todos los productos
  getAll: () => {
    const query = 'SELECT * FROM productos';
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) {
          console.error('Error al obtener todos los productos:', err);
          return reject(err);
        }
        resolve(results);
      });
    });
  },

  // Obtener productos por Business Manager ID
  getByManager: (businessManagerId) => {
    const query = 'SELECT * FROM productos WHERE business_manager_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [businessManagerId], (err, results) => {
        if (err) {
          console.error('Error al obtener productos por manager:', err);
          return reject(err);
        }
        resolve(results);
      });
    });
  },

  // Crear un producto
  create: (productData) => {
    const query = `
      INSERT INTO productos 
      (business_manager_id, codigo, nombre, descripcion, categoria, cantidad, precio, imagen_url, publicado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      productData.business_manager_id,
      productData.codigo,
      productData.nombre,
      productData.descripcion,
      productData.categoria,
      productData.cantidad,
      productData.precio,
      productData.imagen_url,
      false, // Publicado inicialmente en falso
    ];
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Error al crear el producto:', err);
          return reject(err);
        }
        resolve(result.insertId);
      });
    });
  },

  // Actualizar un producto
  update: (id, productData) => {
    const query = `
      UPDATE productos 
      SET nombre = ?, descripcion = ?, categoria = ?, cantidad = ?, precio = ?, imagen_url = ?, publicado = ?
      WHERE id = ?
    `;
    const values = [
      productData.nombre,
      productData.descripcion,
      productData.categoria,
      productData.cantidad,
      productData.precio,
      productData.imagen_url || null, // Mantener la imagen actual si no se proporciona una nueva
      productData.publicado,
      id,
    ];
    return new Promise((resolve, reject) => {
      db.query(query, values, (err, result) => {
        if (err) {
          console.error('Error al actualizar el producto:', err);
          return reject(err);
        }
        resolve(result);
      });
    });
  },

  // Eliminar un producto
  delete: (id) => {
    const query = 'DELETE FROM productos WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, result) => {
        if (err) {
          console.error('Error al eliminar el producto:', err);
          return reject(err);
        }
        resolve(result);
      });
    });
  },
};

module.exports = Product;

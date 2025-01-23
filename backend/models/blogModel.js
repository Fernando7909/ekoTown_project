const db = require('../config/db');

// Crear un nuevo post de blog
exports.createBlog = (blogData, callback) => {
  if (!blogData.title || !blogData.content || !blogData.author || !blogData.businessManagerId) {
    return callback(new Error('Todos los campos obligatorios deben estar presentes.'));
  }

  const query = `
    INSERT INTO blogs (title, content, category, author, businessManagerId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, NOW(), NOW())
  `;
  const values = [
    blogData.title,
    blogData.content,
    blogData.category || 'General', // Usar "General" si no se proporciona categoría
    blogData.author,
    blogData.businessManagerId,
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al crear el blog:', err);
      return callback(err);
    }
    callback(null, result);
  });
};

// Obtener todos los blogs
exports.getAllBlogs = (callback) => {
  const query = `SELECT * FROM blogs`;
  db.query(query, callback);
};

// Obtener un blog por ID
exports.getBlogById = (id, callback) => {
  const query = `SELECT * FROM blogs WHERE id = ?`;
  db.query(query, [id], callback);
};

// Obtener blogs por categoría
exports.getBlogsByCategory = (category, callback) => {
  const query = `SELECT * FROM blogs WHERE category LIKE ?`;
  db.query(query, [`%${category}%`], callback);
};

// Actualizar un blog por ID
exports.updateBlog = (id, blogData, callback) => {
  const query = `
    UPDATE blogs
    SET title = ?, content = ?, category = ?, author = ?
    WHERE id = ?
  `;
  const values = [
    blogData.title,
    blogData.content,
    blogData.category,
    blogData.author,
    id,
  ];
  db.query(query, values, callback);
};

// Eliminar un blog por ID
exports.deleteBlog = (id, callback) => {
  const query = `DELETE FROM blogs WHERE id = ?`;
  db.query(query, [id], callback);
};

// Obtener blogs por businessManagerId
exports.getBlogsByBusinessManagerId = (businessManagerId, callback) => {
  const query = 'SELECT * FROM blogs WHERE businessManagerId = ?';
  db.query(query, [businessManagerId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};
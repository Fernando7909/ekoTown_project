const Blog = require('../models/blogModel');

// Crear un nuevo blog
exports.createBlog = (req, res) => {
  const { title, content, category, author, businessManagerId } = req.body;

  if (!title || !content || !author || !businessManagerId) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Verificar si el Business Manager existe (esto puede ser mejorado dependiendo de la lógica de tu aplicación)
  if (!Number.isInteger(businessManagerId)) {
    return res.status(400).json({ message: 'El ID del Business Manager no es válido' });
  }

  Blog.createBlog({ title, content, category, author, businessManagerId }, (err, result) => {
    if (err) {
      console.error('Error al crear el blog:', err);
      return res.status(500).json({ message: 'Error al crear el blog', error: err });
    }

    res.status(201).json({ message: 'Blog creado exitosamente', blogId: result.insertId });
  });
};



// Actualizar un blog
exports.updateBlog = (req, res) => {
  const { id } = req.params;
  const { title, content, category, author, businessManagerId } = req.body;

  // Verificar si el ID del blog y el ID del Business Manager son válidos
  if (!id || !businessManagerId || isNaN(id) || isNaN(businessManagerId)) {
    return res.status(400).json({ message: 'El ID del blog y el ID del Business Manager son obligatorios y válidos' });
  }

  // Crear el objeto con los datos del blog a actualizar, incluyendo businessManagerId
  const blogData = { 
    title, 
    content, 
    category, 
    author, 
    businessManagerId 
  };

  // Llamar al modelo para actualizar el blog
  Blog.updateBlog(id, blogData, (err, results) => {
    if (err) {
      console.error('Error al actualizar el blog:', err);
      return res.status(500).json({ message: 'Error al actualizar el blog', error: err });
    }

    // Verificar si se encontró el blog a actualizar
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Blog no encontrado' });
    }

    // Responder que el blog fue actualizado correctamente
    res.status(200).json({ message: 'Blog actualizado correctamente' });
  });
};


// Eliminar un blog
exports.deleteBlog = (req, res) => {
  const { id } = req.params;

  if (!id || !Number.isInteger(Number(id))) {
    return res.status(400).json({ message: 'El ID del blog es obligatorio y válido' });
  }

  Blog.deleteBlog(id, (err, results) => {
    if (err) {
      console.error('Error al eliminar el blog:', err);
      return res.status(500).json({ message: 'Error al eliminar el blog', error: err });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Blog no encontrado' });
    }

    res.status(200).json({ message: 'Blog eliminado correctamente' });
  });
};

// Obtener todos los blogs
exports.getAllBlogs = (req, res) => {
  Blog.getAllBlogs((err, results) => {
    if (err) {
      console.error('Error al obtener los blogs:', err);
      return res.status(500).json({ message: 'Error al obtener los blogs' });
    }
    res.status(200).json(results); 
  });
};

// Obtener blogs por categoría
exports.getBlogsByCategory = (req, res) => {
  const { category } = req.params;

  Blog.getBlogsByCategory(category, (err, results) => {
    if (err) {
      console.error('Error al obtener los blogs por categoría:', err);
      return res.status(500).json({ message: 'Error al obtener los blogs por categoría', error: err });
    }

    res.status(200).json(results);
  });
};

// Obtener un blog por ID
exports.getBlogById = (req, res) => {
  const blogId = req.params.id;

  if (!blogId || !Number.isInteger(Number(blogId))) {
    return res.status(400).json({ message: 'El ID del blog es obligatorio y válido' });
  }

  Blog.getBlogById(blogId, (err, results) => {
    if (err) {
      console.error('Error al obtener el blog por ID:', err);
      return res.status(500).json({ message: 'Error al obtener el blog por ID', error: err });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Blog no encontrado' });
    }

    res.status(200).json(results[0]); 
  });
};


// Obtener blogs por businessManagerId
exports.getBlogsByBusinessManagerId = (req, res) => {
  const { businessManagerId } = req.params;

  if (!businessManagerId || !Number.isInteger(Number(businessManagerId))) {
    return res.status(400).json({ message: 'El ID del Business Manager es obligatorio y válido' });
  }

  Blog.getBlogsByBusinessManagerId(businessManagerId, (err, results) => {
    if (err) {
      console.error('Error al obtener los blogs por businessManagerId:', err);
      return res.status(500).json({ message: 'Error al obtener los blogs por businessManagerId', error: err });
    }

    res.status(200).json(results);
  });
};

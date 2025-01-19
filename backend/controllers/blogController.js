const Blog = require('../models/blogModel');


// Crear un nuevo blog
exports.createBlog = (req, res) => {
    const { title, content, category, author, businessManagerId } = req.body;
  
    // Validar los campos requeridos
    if (!title || !content || !author || !businessManagerId) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
  
    // Crear el blog utilizando el modelo
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
  
    // Validar los campos requeridos
    if (!id || !businessManagerId) {
      return res.status(400).json({ message: 'El ID del blog y el ID del Business Manager son obligatorios' });
    }
  
    const blogData = {
      title,
      content,
      category,
      author,
    };
  
    Blog.updateBlog(id, blogData, (err, results) => {
      if (err) {
        console.error('Error al actualizar el blog:', err);
        return res.status(500).json({ message: 'Error al actualizar el blog', error: err });
      }
  
      // Verificar si el blog fue encontrado y actualizado
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Blog no encontrado' });
      }
  
      res.status(200).json({ message: 'Blog actualizado correctamente' });
    });
  };

// Eliminar un blog
exports.deleteBlog = (req, res) => {
    const { id } = req.params;
  
    // Validar que se haya proporcionado el ID del blog
    if (!id) {
      return res.status(400).json({ message: 'El ID del blog es obligatorio' });
    }
  
    Blog.deleteBlog(id, (err, results) => {
      if (err) {
        console.error('Error al eliminar el blog:', err);
        return res.status(500).json({ message: 'Error al eliminar el blog', error: err });
      }
  
      // Verificar si el blog fue encontrado y eliminado
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
        res.status(200).json(results); // Respuesta en formato JSON
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
    const blogId = req.params.id; // Obtener el ID del blog desde los parámetros de la URL
  
    Blog.getBlogById(blogId, (err, results) => {
      if (err) {
        console.error('Error al obtener el blog por ID:', err);
        return res.status(500).json({ message: 'Error al obtener el blog por ID', error: err });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Blog no encontrado' });
      }
  
      res.status(200).json(results[0]); // Retorna el primer resultado (debería ser único por ID)
    });
  };
  

const path = require('path');
const fs = require('fs');
const db = require('../config/db'); // Conexión a la base de datos

// Validar que la carpeta 'uploads' exista
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Función para agregar ruta completa a las imágenes
const addFullImagePath = (product) => {
    return {
        ...product,
        imagen_url: product.imagen_url
            ? `http://localhost:3000${product.imagen_url}`.replace(/\\/g, '/')
            : null,
    };
};

// Crear un producto
exports.createProduct = (req, res) => {
    console.log('Datos recibidos:', req.body); // Verificar datos enviados
    console.log('Archivo recibido:', req.file); // Verificar archivo recibido

    const { business_manager_id, codigo, nombre, descripcion, categoria, cantidad, precio } = req.body;

    let imagenUrl = null;
    if (req.file) {
        imagenUrl = `/uploads/${req.file.filename}`; // Ruta de la imagen
    }

    const query = `
        INSERT INTO productos (business_manager_id, codigo, nombre, descripcion, categoria, cantidad, precio, imagen_url, publicado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [business_manager_id, codigo, nombre, descripcion, categoria, cantidad, precio, imagenUrl, false];

    console.log('Valores para insertar en la base de datos:', values); // Log para depuración

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al crear producto:', err); // Log de error
            return res.status(500).send('Error al crear producto');
        }
        res.status(201).send({ message: 'Producto creado con éxito', id: result.insertId });
    });
};


// Obtener todos los productos
exports.getAllProducts = (req, res) => {
    const query = `SELECT * FROM productos`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).send('Error al obtener productos');
        }

        const productsWithFullPath = results.map(addFullImagePath);

        res.status(200).send(productsWithFullPath);
    });
};

// Obtener productos por Business Manager
exports.getProductsByBusinessManager = (req, res) => {
    const { business_manager_id } = req.params;
    const query = `SELECT * FROM productos WHERE business_manager_id = ?`;

    db.query(query, [business_manager_id], (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).send('Error al obtener productos');
        }

        const productsWithFullPath = results.map(product => ({
            ...product,
            imagen_url: product.imagen_url
                ? `http://localhost:3000${product.imagen_url}`.replace(/\\/g, '/')
                : null,
        }));

        res.status(200).send(productsWithFullPath);
    });
};


// Actualizar un producto
exports.updateProduct = async (req, res) => {
    console.log('Datos recibidos para actualizar:', req.body);
    console.log('Archivo recibido:', req.file);

    const { id } = req.params;
    const { nombre, descripcion, categoria, cantidad, precio, publicado } = req.body;

    // Validar entrada
    if (!id || !nombre || !descripcion || !categoria || !cantidad || !precio) {
        return res.status(400).send({ error: 'Faltan datos obligatorios para actualizar el producto.' });
    }

    // Convertir "publicado" a un valor booleano/número adecuado
    const publicadoValue = publicado === 'true' || publicado === '1' || publicado === true ? 1 : 0;

    // Manejar URL de la imagen
    let imagenUrl = req.body.imagen_url || null;
    if (req.file) {
        imagenUrl = `/uploads/${req.file.filename}`;
    } else if (!imagenUrl) {
        try {
            const [results] = await db.promise().query(`SELECT imagen_url FROM productos WHERE id = ?`, [id]);
            if (results.length > 0) {
                imagenUrl = results[0].imagen_url || null;
            }
        } catch (error) {
            console.error('Error al recuperar URL de la imagen:', error);
            return res.status(500).send('Error al actualizar producto.');
        }
    }

    // Preparar consulta de actualización
    const query = `
        UPDATE productos 
        SET nombre = ?, descripcion = ?, categoria = ?, cantidad = ?, precio = ?, imagen_url = ?, publicado = ?
        WHERE id = ?
    `;
    const values = [nombre, descripcion, categoria, cantidad, precio, imagenUrl, publicadoValue, id];

    console.log('Valores para actualizar en la base de datos:', values);

    try {
        const [result] = await db.promise().query(query, values);
        if (result.affectedRows === 0) {
            return res.status(404).send({ message: 'Producto no encontrado.' });
        }
        res.status(200).send({ message: 'Producto actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).send('Error al actualizar producto');
    }
};




// Eliminar un producto
exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    const getImageQuery = `SELECT imagen_url FROM productos WHERE id = ?`;
    db.query(getImageQuery, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener imagen del producto:', err);
            return res.status(500).send('Error al eliminar producto');
        }

        if (results.length > 0 && results[0].imagen_url) {
            const imagePath = path.join(__dirname, '../', results[0].imagen_url);

            fs.unlink(imagePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error al eliminar imagen:', unlinkErr);
                }
            });
        }

        const deleteQuery = `DELETE FROM productos WHERE id = ?`;
        db.query(deleteQuery, [id], (err) => {
            if (err) {
                console.error('Error al eliminar producto:', err);
                return res.status(500).send('Error al eliminar producto');
            }
            res.status(200).send({ message: 'Producto eliminado con éxito' });
        });
    });
};

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

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al crear producto:', err);
            return res.status(500).send('Error al crear producto');
        }
        res.status(201).send({ message: 'Producto creado con éxito', id: result.insertId });
    });
};

// Obtener todos los productos
exports.getAllProducts = (req, res) => {
    const query = `
        SELECT 
            id, 
            business_manager_id, 
            codigo, 
            nombre, 
            descripcion, 
            categoria, 
            cantidad AS stock, 
            precio, 
            imagen_url, 
            publicado 
        FROM productos
    `;

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

        const productsWithFullPath = results.map(addFullImagePath);
        res.status(200).send(productsWithFullPath);
    });
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, categoria, cantidad, precio, publicado } = req.body;

    let imagenUrl = req.body.imagen_url || null;
    if (req.file) {
        imagenUrl = `/uploads/${req.file.filename}`;
    }

    const query = `
        UPDATE productos 
        SET nombre = ?, descripcion = ?, categoria = ?, cantidad = ?, precio = ?, imagen_url = ?, publicado = ?
        WHERE id = ?
    `;
    const values = [nombre, descripcion, categoria, cantidad, precio, imagenUrl, publicado, id];

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

// Procesar compra y vaciar carrito
exports.processPurchase = (req, res) => {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).send({ error: 'No se recibieron productos para procesar la compra.' });
    }

    db.beginTransaction((err) => {
        if (err) {
            console.error('Error al iniciar la transacción:', err);
            return res.status(500).send({ error: 'Error al procesar la compra.' });
        }

        let queriesCompleted = 0;

        items.forEach((item) => {
            // Verificar stock
            db.query(`SELECT cantidad FROM productos WHERE id = ?`, [item.id], (err, rows) => {
                if (err) {
                    console.error('Error al verificar el stock:', err);
                    return db.rollback(() => {
                        res.status(500).send({ error: 'Error al procesar la compra.' });
                    });
                }

                if (rows.length === 0 || rows[0].cantidad < item.cantidad) {
                    return db.rollback(() => {
                        res.status(400).send({
                            error: `Stock insuficiente para el producto con ID ${item.id}. Disponible: ${rows[0]?.cantidad || 0}`,
                        });
                    });
                }

                // Actualizar stock
                db.query(
                    `UPDATE productos SET cantidad = cantidad - ? WHERE id = ?`,
                    [item.cantidad, item.id],
                    (err) => {
                        if (err) {
                            console.error('Error al actualizar el stock:', err);
                            return db.rollback(() => {
                                res.status(500).send({ error: 'Error al procesar la compra.' });
                            });
                        }

                        queriesCompleted++;

                        // Confirmar la transacción cuando todas las queries estén completas
                        if (queriesCompleted === items.length) {
                            db.commit((err) => {
                                if (err) {
                                    console.error('Error al confirmar la transacción:', err);
                                    return db.rollback(() => {
                                        res.status(500).send({ error: 'Error al procesar la compra.' });
                                    });
                                }

                                res.status(200).send({ message: 'Compra procesada con éxito.' });
                            });
                        }
                    }
                );
            });
        });
    });
};


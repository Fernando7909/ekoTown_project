const path = require('path');
const fs = require('fs');
const db = require('../config/db'); // Conexión a la base de datos

// Crear un producto
exports.createProduct = (req, res) => {
    const { business_manager_id, codigo, nombre, descripcion, categoria, cantidad, precio } = req.body;

    let imagenUrl = null;
    if (req.file) {
        imagenUrl = `/uploads/${req.file.filename}`;
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
    const query = `SELECT * FROM productos`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            return res.status(500).send('Error al obtener productos');
        }
        res.status(200).send(results);
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
        res.status(200).send(results);
    });
};

// Actualizar un producto
exports.updateProduct = (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, categoria, cantidad, precio, publicado } = req.body;

    let imagenUrl = req.body.imagen_url || null; // Si no hay imagen nueva, se mantiene la existente
    if (req.file) {
        imagenUrl = `/uploads/${req.file.filename}`;
    }

    const query = `
        UPDATE productos 
        SET nombre = ?, descripcion = ?, categoria = ?, cantidad = ?, precio = ?, imagen_url = ?, publicado = ?
        WHERE id = ?
    `;
    const values = [nombre, descripcion, categoria, cantidad, precio, imagenUrl, publicado, id];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            return res.status(500).send('Error al actualizar producto');
        }
        res.status(200).send({ message: 'Producto actualizado con éxito' });
    });
};

// Eliminar un producto
exports.deleteProduct = (req, res) => {
    const { id } = req.params;

    // Primero obtener la imagen asociada al producto
    const getImageQuery = `SELECT imagen_url FROM productos WHERE id = ?`;
    db.query(getImageQuery, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener imagen del producto:', err);
            return res.status(500).send('Error al eliminar producto');
        }

        if (results.length > 0 && results[0].imagen_url) {
            const imagePath = path.join(__dirname, '../', results[0].imagen_url);

            // Eliminar la imagen físicamente
            fs.unlink(imagePath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error('Error al eliminar imagen:', unlinkErr);
                }
            });
        }

        // Luego eliminar el producto de la base de datos
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

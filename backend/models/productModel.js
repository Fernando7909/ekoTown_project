const Product = require('../models/productModel');

// Obtener todos los productos
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.getAll();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

// Obtener productos por Business Manager
const getProductsByManager = async (req, res) => {
    const { business_manager_id } = req.params;
    try {
        const products = await Product.getByManager(business_manager_id);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error al obtener productos por manager:', error);
        res.status(500).json({ error: 'Error al obtener productos por manager' });
    }
};

// Crear un producto
const createProduct = async (req, res) => {
    const { business_manager_id, codigo, nombre, descripcion, categoria, cantidad, precio } = req.body;
    const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const productId = await Product.create({
            business_manager_id,
            codigo,
            nombre,
            descripcion,
            categoria,
            cantidad,
            precio,
            imagen_url,
        });
        res.status(201).json({ message: 'Producto creado con éxito', id: productId });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error al crear producto' });
    }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, categoria, cantidad, precio, publicado } = req.body;
    const imagen_url = req.file ? `/uploads/${req.file.filename}` : req.body.imagen_url || null;

    try {
        await Product.update(id, {
            nombre,
            descripcion,
            categoria,
            cantidad,
            precio,
            imagen_url,
            publicado,
        });
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

// Eliminar un producto
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await Product.delete(id);
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};

module.exports = {
    getAllProducts,
    getProductsByManager,
    createProduct,
    updateProduct,
    deleteProduct,
};

const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');
const multer = require('multer'); // Importar multer para manejar subidas de archivos


// Importar rutas
const userRoutes = require('./routes/userRoutes');
const businessManagerRoutes = require('./routes/businessManagerRoutes');
const storeRoutes = require('./routes/storeRoutes');
const productRoutes = require('./routes/productRoutes');

dotenv.config();
const app = express();

// Middleware global
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Establece un límite de 10 MB para JSON
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Establece un límite de 10 MB para datos codificados en URL

// Configuración de multer para manejar subidas de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')); // Guardar archivos en la carpeta "uploads"
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Nombre único para cada archivo
    },
});

const upload = multer({ storage });

// Middleware para servir archivos estáticos
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// Registrar solicitudes en la consola
app.use((req, res, next) => {
    console.log(`Solicitud recibida: ${req.method} ${req.url}`);
    console.log('Cuerpo:', req.body);
    next();
});

// Datos de ejemplo de comercios ecológicos
const comerciosEcologicos = [
    { municipio: 'Madrid', nombre: 'EcoMadrid', tipo: 'Tienda de alimentos' },
    { municipio: 'Barcelona', nombre: 'EcoBarcelona', tipo: 'Tienda de ropa' },
    { municipio: 'Valencia', nombre: 'EcoValencia', tipo: 'Restaurante' },
];

// Ruta para obtener comercios por municipio
app.get('/api/comercios/:municipio', (req, res) => {
    const municipio = req.params.municipio.toLowerCase();
    const resultados = comerciosEcologicos.filter(comercio =>
        comercio.municipio.toLowerCase() === municipio
    );

    if (resultados.length === 0) {
        return res.status(404).json({ mensaje: 'No se encontraron comercios en este municipio' });
    }

    res.json(resultados);
});

// Ruta para buscar tiendas en la API de Yelp
const apiKey = process.env.API_KEY;

app.get('/api/yelp', async (req, res) => {
    const { location, categories, radius } = req.query;

    try {
        const yelpUrl = `https://api.yelp.com/v3/businesses/search?location=${location}&categories=${categories}&radius=${radius}`;
        const response = await fetch(yelpUrl, {
            headers: { 'Authorization': `Bearer ${apiKey}` },
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error al buscar datos en Yelp:', error);
        res.status(500).json({ error: 'Error al obtener datos de Yelp' });
    }
});

// Rutas para usuarios
app.use('/api/users', userRoutes);

// Rutas para Business Managers
app.use('/api/business-managers', businessManagerRoutes);

// Ruta para Stores
app.use('/api/stores', storeRoutes);

// Rutas para productos (con soporte para subidas de imágenes)
app.use('/api/productos', productRoutes);


// Configuración del puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

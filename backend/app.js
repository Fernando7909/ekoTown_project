const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const businessManagerRoutes = require('./routes/businessManagerRoutes');
const storeRoutes = require('./routes/storeRoutes');

dotenv.config();
const app = express();

// Middleware global
app.use(cors());
app.use(express.json()); // Manejar solicitudes JSON

// Middleware para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Configuración del puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

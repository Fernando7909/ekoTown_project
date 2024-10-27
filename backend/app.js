import dotenv from 'dotenv';  // Cambiado a import
import express from 'express';  // Cambiado a import
import cors from 'cors';  // Cambiado a import
import fetch from 'node-fetch';  // Cambiado a import

dotenv.config();
const app = express();

// Middleware para habilitar CORS y manejar JSON
app.use(cors());
app.use(express.json());

// Datos de ejemplo de comercios ecológicos (esto es solo para tu caso específico)
const comerciosEcologicos = [
    { municipio: 'Madrid', nombre: 'EcoMadrid', tipo: 'Tienda de alimentos' },
    { municipio: 'Barcelona', nombre: 'EcoBarcelona', tipo: 'Tienda de ropa' },
    { municipio: 'Valencia', nombre: 'EcoValencia', tipo: 'Restaurante' },
];

// Ruta para obtener comercios por municipio (esto ya lo tienes)
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

// Ruta para buscar tiendas en la API de Yelp con location, categories y radius
const apiKey = process.env.API_KEY;

app.get('/api/yelp', async (req, res) => {
    const { location, categories, radius } = req.query;

    try {
        // Construir la URL con los parámetros de búsqueda
        const yelpUrl = `https://api.yelp.com/v3/businesses/search?location=${location}&categories=${categories}&radius=${radius}`;

        // Hacer la solicitud a la API de Yelp
        const response = await fetch(yelpUrl, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });

        // Parsear la respuesta a JSON
        const data = await response.json();

        // Enviar la respuesta JSON al frontend
        res.json(data);
    } catch (error) {
        console.error('Error al buscar datos en Yelp:', error);
        res.status(500).json({ error: 'Error al obtener datos de Yelp' });
    }
});



// Configurar el puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

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

// **Nuevo código**: Ruta para hacer una petición a una API externa
const apiKey = process.env.API_KEY;

app.get('/api/external', async (req, res) => {
    try {
        // Reemplaza con la URL correcta de la API que estás consumiendo
        const response = await fetch(`https://api.externa.com/data?api_key=${BH0TuLMfvbaj6gZAk8rnhOKI187RM9xGdietQ8cDx8zUJjzmOL-MjSxIj9gP4T_Cab10r9Ht8XXWyF7zMO8NPi38iFx4__Xbcbokfn8Q7yEm_9Ds_Iw2QDKkEWIJZ3Yx}`);
        const data = await response.json();
        res.json(data);  // Envía los datos de la API externa al frontend
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener datos de la API externa' });
    }
});

// Configurar el puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

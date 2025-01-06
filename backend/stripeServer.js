const express = require('express');
const Stripe = require('stripe');
const router = express.Router();

// Configuración de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Utiliza la clave secreta desde las variables de entorno

// Middleware para registrar solicitudes
router.use((req, res, next) => {
    console.log(`Solicitud recibida en Stripe API: ${req.method} ${req.url}`);
    console.log('Cuerpo:', req.body);
    next();
});

// Endpoint para crear una sesión de Stripe Checkout
router.post('/create-checkout-session', async (req, res) => {
    const { items } = req.body; // Espera que se envíen los productos en el cuerpo de la solicitud

    try {
        // Configurar los artículos de la sesión
        const lineItems = items.map((item) => ({
            price_data: {
                currency: 'eur', // Configuración de la moneda
                product_data: { name: item.name }, // Nombre del producto
                unit_amount: item.price,
            },
            quantity: item.quantity, // Cantidad del producto
        }));

        // Crear una sesión de Stripe Checkout
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], // Métodos de pago aceptados
            line_items: lineItems, // Artículos de la compra
            mode: 'payment', // Modo de pago único
            success_url: 'http://localhost:4200/?purchase=success', // URL de éxito con parámetro
            cancel_url: 'http://localhost:4200/', // URL de cancelación
        });

        // Responder con el ID de la sesión
        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error al crear la sesión de Stripe:', error);
        res.status(500).json({ error: 'No se pudo crear la sesión de Stripe.' });
    }
});

// Probar que el servidor de Stripe está activo
router.get('/test', (req, res) => {
    res.send('Servidor de Stripe está funcionando correctamente.');
});

module.exports = router;
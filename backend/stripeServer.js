const express = require('express');
const Stripe = require('stripe');
const router = express.Router();
const db = require('./config/db'); // Conexión a la base de datos

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
            metadata: {
                items: JSON.stringify(items), // Enviar los productos y cantidades como metadatos
            },
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

// Endpoint del webhook de Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;
    try {
        // Validar la firma del webhook
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET // Asegúrate de configurar esta variable de entorno
        );
    } catch (err) {
        console.error('Error validando el webhook:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Procesar el evento de Stripe
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Aquí almacenaremos los items enviados al crear la sesión
        const items = session.metadata.items
            ? JSON.parse(session.metadata.items)
            : [];

        try {
            // Actualizar el stock de cada producto
            for (const item of items) {
                const { productId, quantity } = item;

                // Reducir el stock en la base de datos
                await new Promise((resolve, reject) => {
                    const query = `UPDATE productos SET cantidad = cantidad - ? WHERE id = ? AND cantidad >= ?`;
                    db.query(query, [quantity, productId, quantity], (err, result) => {
                        if (err) {
                            console.error('Error actualizando el stock:', err);
                            return reject(err);
                        }
                        if (result.affectedRows === 0) {
                            console.warn(`No se pudo actualizar el stock para el producto con ID ${productId}.`);
                        }
                        resolve();
                    });
                });
            }
            console.log('Stock actualizado correctamente.');
            res.status(200).send({ received: true });
        } catch (error) {
            console.error('Error al procesar el webhook:', error);
            res.status(500).send('Error procesando el webhook.');
        }
    } else {
        console.log(`Evento no procesado: ${event.type}`);
        res.status(200).send({ received: true });
    }
});

// Probar que el servidor de Stripe está activo
router.get('/test', (req, res) => {
    res.send('Servidor de Stripe está funcionando correctamente.');
});

module.exports = router;

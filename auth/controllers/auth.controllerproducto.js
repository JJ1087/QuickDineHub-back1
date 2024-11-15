const Producto = require('../models/auth.modelMenu');
const oferta = require('../models/auth.modelOferta');
const PushSubscription = require('../models/auth.modelpushsubscription'); // Modelo de suscripciones
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const webpush = require('web-push');


// Claves VAPID para Web Push (asegúrate de obtener las correctas desde tu servicio de Push)
// Configurar las claves VAPID
const vapidKeys = {
    publicKey: "BOpKJl1P-s-gcH5dhTqjzF6-KbB-D8lenn3kYMhhpvGEq1TLSFUpaOa6698F5ZLg0yGVbLqSBdhvuO7I94m8cMc",
    privateKey: "9HeLyr98wdMf1-sXyF5aducGyykqDP-D69nzIp1BgOA"
};

// Establecer las claves VAPID
webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

const getBaseUrl = () => {
    if (process.env.NODE_ENV === 'production') {
        // En producción (Render, por ejemplo), usamos la URL pública de tu servidor
        return 'https://quickdinehub-back1.onrender.com';  // URL de tu API en Render
    } else {
        // En desarrollo (localhost), usamos la URL de tu servidor local
        return 'http://localhost:3000';  // URL de tu API en local
    }
};

// Función para enviar notificación
const enviarNotificacion = (title, body, imagenProducto, url) => {
    const baseUrl = getBaseUrl();
    const payload = {
        notification: {
            title: title,
            body: body,
            icon: 'https://res.cloudinary.com/dnzbkzkrp/image/upload/v1731285748/jh3vyvlbcscpdl9muco3.png', // Icono fijo para las notificaciones
            image: `${baseUrl}/${imagenProducto.replace(/\\/g, '/')}`, // Usar la imagen específica del producto o oferta
            vibrate: [100, 50, 100],
            actions: [{
                action: "explore",
                title: "Ver Oferta o Producto",
                url: url
            }]
        }
    };

    // Obtener todas las suscripciones de usuarios
    PushSubscription.find()
        .exec()
        .then(subscriptions => {
            subscriptions.forEach(subscription => {
                webpush.sendNotification(subscription, JSON.stringify(payload))
                    .catch(err => {
                        console.error('Error al enviar notificación:', err);
                    });
            });
        })
        .catch(err => {
            console.error('Error al obtener suscripciones:', err);
        });
};

// Crear un producto
exports.Crearproducto = async (req, res, next) => {
    try {
        console.log('Datos recibidos del Front:', req.body);

        // Convertir la cadena de etiquetas en un array
        const etiquetasArray = JSON.parse(req.body.etiquetas);

        // Crear nuevo producto
        const nuevoProducto = new Producto({
            _id: new mongoose.Types.ObjectId(),
            idRestaurante: req.body.idRestaurante,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            categoria: 'Comida Regional Mexicana',
            tiempoP: req.body.tiempoP,
            precio: req.body.precio,
            etiquetas: etiquetasArray,
            oferta: 'Null',
            descuento: '00',
            costoEnvio: '10',
            imagen: req.files.map(file => file.path),
        });

        // Guardar el producto en la base de datos
        await nuevoProducto.save();

        // Enviar notificación de producto creado
        enviarNotificacion(
            `Nuevo Producto para ti en ! ${req.body.nombrerestaurante} !`,
            `${req.body.nombre}: ${req.body.descripcion} - $${req.body.precio}`,
            req.files[0].path, // Usamos la primera imagen como la imagen del producto
            "https://quickdinehub-front1.web.app/login-clientes" // URL donde pueden ver más detalles
        );

        res.status(201).json({ message: 'PRODUCTO CREADO' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'ERROR INESPERADO' });
    }
};

// Mostrar todos los productos de un restaurante
exports.mostrarproducto = async (req, res, next) => {
    try {
        const productos = await Producto.find({ idRestaurante: req.params.restauranteId });

        const productosModificados = productos.map(producto => ({
            ...producto.toObject(),
            precio: parseFloat(producto.precio.toString()), // Convertir Decimal128 a número
            descuento: parseFloat(producto.descuento.toString())
        }));

        res.status(200).json(productosModificados);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'ERROR INESPERADO' });
    }
};

// Eliminar producto
exports.eliminarProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const producto = await Producto.findById(id);

        if (!producto) {
            return res.status(404).json({ mensaje: 'El producto no fue encontrado' });
        }

        // Eliminar imágenes asociadas al producto
        producto.imagen.forEach(imagen => {
            const imagePath = path.join(__dirname, '..', '..', imagen.replace(/\\/g, '/'));
            fs.unlinkSync(imagePath);
        });

        await Producto.findByIdAndDelete(id);

        res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ mensaje: 'Hubo un error al eliminar el producto' });
    }
};

// Crear oferta
exports.Crearoferta = async (req, res, next) => {
    try {
        console.log('Datos recibidos del Front:', req.body);

        const nuevaOferta = new oferta({
            _id: new mongoose.Types.ObjectId(),
            idRestaurante: req.body.idRestaurante,
            nombrerestaurante: req.body.nombrerestaurante,
            titulo: req.body.titulo,
            descripcion: req.body.descripcion,
            TipoOferta: req.body.TipoOferta,
            precioOriginal: req.body.precioOriginal,
            precioOferta: req.body.precioOferta,
            imagen: req.files.map(file => file.path),
        });

        // Guardar la oferta en la base de datos
        await nuevaOferta.save();

        // Enviar notificación de oferta creada
        enviarNotificacion(
            `¡Aprovecha Nueva Oferta en ${req.body.nombrerestaurante}! `,
            `${req.body.titulo}: ${req.body.descripcion} - De $${req.body.precioOriginal} a $${req.body.precioOferta}`,
            req.files[0].path, // Usamos la primera imagen como la imagen de la oferta
            "https://quickdinehub-front1.web.app/login-clientes" // URL donde pueden ver más detalles
        );

        res.status(201).json({ message: 'OFERTA CREADA' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'ERROR INESPERADO' });
    }
};

// Mostrar ofertas de un restaurante
exports.mostraroferta = async (req, res, next) => {
    try {
        const ofertas = await oferta.find({ idRestaurante: req.params.restauranteId });

        const ofertasModificados = ofertas.map(oferta => ({
            ...oferta.toObject(),
            precioOriginal: parseFloat(oferta.precioOriginal.toString()),
            precioOferta: parseFloat(oferta.precioOferta.toString())
        }));

        res.status(200).json(ofertasModificados);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'ERROR INESPERADO' });
    }
};

// Eliminar oferta
exports.eliminarOferta = async (req, res) => {
    try {
        const { id } = req.params;

        const ofertaData = await oferta.findById(id);

        if (!ofertaData) {
            return res.status(404).json({ mensaje: 'La oferta no fue encontrada' });
        }

        ofertaData.imagen.forEach(imagen => {
            const imagePath = path.join(__dirname, '..', '..', imagen.replace(/\\/g, '/'));
            fs.unlinkSync(imagePath);
        });

        await oferta.findByIdAndDelete(id);

        res.status(200).json({ mensaje: 'Oferta eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la oferta:', error);
        res.status(500).json({ mensaje: 'Hubo un error al eliminar la oferta' });
    }
};

// Obtener información de todas las ofertas para los clientes
exports.obtenerInfoOferta = async (req, res, next) => {
    try {
        const ofertas = await oferta.find({}, { _id: 1, titulo: 1, imagen: 1, nombrerestaurante: 1, descripcion: 1, TipoOferta: 1, precioOriginal: 1, precioOferta: 1 });

        const ofertasModificados = ofertas.map(oferta => ({
            ...oferta.toObject(),
            precioOriginal: parseFloat(oferta.precioOriginal.toString()),
            precioOferta: parseFloat(oferta.precioOferta.toString())
        }));

        ofertas.forEach(ofert => {
            if (!Array.isArray(ofert.imagen)) {
                ofert.imagen = [];
            }
        });

        res.status(200).json(ofertasModificados);
    } catch (error) {
        console.error('Error al obtener la información de productos:', error);
        res.status(500).json({ error: 'Error del servidor al obtener la información de los productos' });
    }
};

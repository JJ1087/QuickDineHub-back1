const mongoose = require("mongoose");
const PushSubscription = require("../models/auth.modelpushsubscription");
const webpush = require('web-push');

// Configurar las claves VAPID
const vapidKeys = {
    publicKey: "BOpKJl1P-s-gcH5dhTqjzF6-KbB-D8lenn3kYMhhpvGEq1TLSFUpaOa6698F5ZLg0yGVbLqSBdhvuO7I94m8cMc",
    privateKey: "9HeLyr98wdMf1-sXyF5aducGyykqDP-D69nzIp1BgOA"
};

webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

// Crear suscripción
exports.createSubscription = (req, res, next) => {
    const { endpoint, keys } = req.body;

    // Validación de que el endpoint y las keys estén presentes
    if (!endpoint || !keys || !keys.auth || !keys.p256dh) {
        return res.status(400).json({ error: "Faltan datos necesarios para la suscripción" });
    }

    // Verificar si la suscripción ya existe
    PushSubscription.findOne({ endpoint: endpoint })
        .then(existingSubscription => {
            if (existingSubscription) {
                // Si la suscripción ya existe, devuelve la suscripción existente
                return res.status(200).json({ message: "Suscripción ya registrada", subscription: existingSubscription });
            } else {
                // Si no existe, crear una nueva suscripción
                const pushSubscription = new PushSubscription({
                    _id: new mongoose.Types.ObjectId(),
                    endpoint: endpoint,
                    keys: keys
                });

                pushSubscription.save()
                    .then(result => {
                        // Enviar notificación de bienvenida tras crear la suscripción
                        enviarNotificacionBienvenida(pushSubscription);
                        res.status(201).json({ message: "Suscripción guardada correctamente", subscription: result });
                    })
                    .catch(err => {
                        console.error('Error al guardar la suscripción:', err);
                        res.status(500).json({ error: 'Hubo un error al guardar la suscripción' });
                    });
            }
        })
        .catch(err => {
            console.error('Error al verificar la suscripción:', err);
            res.status(500).json({ error: 'Hubo un error al verificar la suscripción' });
        });
};

// Enviar notificación
exports.enviarNotificacion = (req, res, next) => {
    const { token } = req.body;

    // Verificar si el token está presente
    if (!token || !token.endpoint || !token.keys) {
        return res.status(400).json({ error: "Faltan datos necesarios para enviar la notificación" });
    }

    // Crear la carga de la notificación
    const payload = {
        notification: {
            title: "😋🍔🍕 Bienvenido a QuickDineHub!🍲🥣🍤",
            body: "Gracias por suscribirte. Descubre los platillos más deliciosos.",
            icon: "https://res.cloudinary.com/dnzbkzkrp/image/upload/v1731285748/jh3vyvlbcscpdl9muco3.png",
            image: "https://res.cloudinary.com/dnzbkzkrp/image/upload/v1731285748/jh3vyvlbcscpdl9muco3.png",
            vibrate: [100, 50, 100],
            actions: [{
                action: "explore",
                title: "Ver nuestras especialidades",
                url: "https://quickdinehub-front1.web.app/login-clientes"
            }]
        }
    };

    // Enviar la notificación utilizando web-push
    webpush.sendNotification(token, JSON.stringify(payload))
        .then(() => {
            res.status(200).json({ message: 'Notificación de bienvenida enviada con éxito' });
        })
        .catch(err => {
            console.error('Error al enviar la notificación:', err);
            res.status(500).json({ error: err.message });
        });
};

// Obtener todas las suscripciones
exports.getAllSubscriptions = (req, res, next) => {
    PushSubscription.find()
        .exec()
        .then(subscriptions => {
            res.status(200).json(subscriptions);
        })
        .catch(err => {
            console.error('Error al obtener suscripciones:', err);
            res.status(500).json({ error: 'Hubo un error al obtener las suscripciones' });
        });
};

// Función para enviar la notificación de bienvenida
const enviarNotificacionBienvenida = (pushSubscription) => {
    const payload = {
        notification: {
            title: "😋🍔🍕 Bienvenido a QuickDineHub!🍲🥣🍤",
            body: "Gracias por suscribirte. Descubre los platillos más deliciosos.",
            icon: "https://res.cloudinary.com/dnzbkzkrp/image/upload/v1731285748/jh3vyvlbcscpdl9muco3.png",
            image: "https://res.cloudinary.com/dnzbkzkrp/image/upload/v1731285748/jh3vyvlbcscpdl9muco3.png",
            vibrate: [100, 50, 100],
            actions: [{
                action: "explore",
                title: "Ver nuestras especialidades",
                url: "https://quickdinehub-front1.web.app/login-clientes"
            }]
        }
    };

    // Enviar la notificación de bienvenida
    webpush.sendNotification(pushSubscription, JSON.stringify(payload))
        .catch(err => {
            console.error('Error al enviar la notificación de bienvenida:', err);
        });
};
const express = require('express');
const router = express.Router();
//compartido

const correoController = require('../controllers/correo.controller');
const userRepartidor = require('../controllers/auth.controllerRepartidor');
const User = require('../controllers/auth.controller'); // Importa el controlador de usuario
const userRestaurante = require('../controllers/auth.controllerrestaurante');
const logs = require('../controllers/auth.controllerLogs');
const rutaPago = require('../controllers/pago.controller')

module.exports = (router) => {
    router.post('/enviar-correo', correoController.enviarCorreo); // correo de verificacio-//compartido

    router.get('/restaurar-con-correo-repartidor/:email', userRepartidor.obtenerPreguntaYRespuestaSecreta); //compartido
    router.post('/restaurar-con-correo-repartidor', userRepartidor.cambiarContraseña); //compartido

    router.get('/restaurar-con-correo/:email', User.obtenerPreguntaYRespuestaSecreta); // Utiliza el controlador de usuario
    router.post('/restaurar-con-correo', User.cambiarContraseña);

    router.get('/restaurar-con-correo-restaurante/:email', userRestaurante.obtenerPreguntaYRespuestaSecreta); // Utiliza el controlador de usuario
    router.post('/restaurar-con-correo-restaurante', userRestaurante.cambiarContraseña);

    router.post('/agregar-log-autentificacion', logs.agregarLogAutenticacion); //LOG AUTENTIFICACION

    router.post('/actualizar-intentos-fallidos', logs.actualizarIntentosFallidos);
    router.get('/obtener-intentos-fallidos', logs.obtenerIntentosFallidos);



    router.post('/enviar-correo-advertencia', correoController.enviarCorreoAdvertencia);
    router.post('/enviar-correo-bloqueo', correoController.enviarCorreBloqueo);

    router.post('/enviar-correo-log', correoController.enviarCorreRestablecimiento);

    router.post('/enviar-correo-cancelarproducto', correoController.correocancelarproducto);
    router.post('/enviar-correo-cancelarOrden', correoController.correocancelarorden);
    router.post('/pago',rutaPago.getData);
    router.post('/data-pago',rutaPago.saveCompra)
}
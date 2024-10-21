const express = require('express');
//MIDELWARES
const archivosRes = require('../middleware/imagenrestaurante');
const archivosProductos = require('../middleware/imagenproducto');
//CONTROLADORES
const userRes = require('../controllers/auth.controllerrestaurante');
const Productos = require('../controllers/auth.controllerproducto');
const {fetchOrdens} = require('../controllers/auth.controllerComensal');
const verificarArchivosYDatos = (req, res, next) => {
    console.log('Datos recibidos en el cuerpo de la solicitud:', req.body);
    console.log('Archivos subidos:', req.files);
    next();
};
module.exports = (router) => {
    router.post('/registro-restaurante', archivosRes, verificarArchivosYDatos, userRes.createUserRes);
    router.post('/login-restaurante', userRes.loginRes);
    //PRODUCTOS:
    router.post('/crear-producto', archivosProductos, verificarArchivosYDatos, Productos.Crearproducto);
    router.get('/mostrar-producto/:restauranteId', Productos.mostrarproducto);
    router.delete('/eliminar-producto/:id', Productos.eliminarProducto);
    // PEDIDOS
    router.get('/mostrar-pedido/:restauranteId', userRes.mostrarpedido);

    router.put('/aceptar-pedido/:pedidoId', userRes.aceptarOrden);
    router.put('/rechazar-pedido/:pedidoId', userRes.rechazarOrden);
    router.put('/terminada-pedido/:pedidoId', userRes.OrdenCompletada);
    router.put('/envio-pedido/:pedidoId', userRes.OrdenEnvio);
    router.put('/cancelar-producto/:pedidoId', userRes.cancelarProducto);//cancelar producto

    router.post('/comprasRealizadasSitio', userRes.agregarventasitio);//ordenes por compras en linea

    router.get('/compras-realizada/:idRestaurante', userRes.obtenerComprasPorRestaurante);// mostrar compras en linea
    
    router.get('/fetchordens', fetchOrdens)

}
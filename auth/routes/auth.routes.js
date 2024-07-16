//Se definen las rutas y los nombres de los procesos
const Comensal = require('../controllers/auth.controllerComensal');
const Users = require('../controllers/auth.controller');
const Product = require('../controllers/auth.controller');
const logs = require('../controllers/auth.controllerLogs');
const express = require('express');
const router = express.Router();
const User = require('../controllers/auth.controller'); // Importa el controlador de usuario


module.exports = (router) => {
    router.post('/registro-cliente', Users.createUser);//s
    router.post('/login-clientes', Users.loginUser);//chico back
    // router.get('/cantidad-productos', Product.obtenerCantidadProductos);
    // router.get('/info-producto', Product.obtenerInfoDeProducto);
    // router.get('/info-producto/:id', Product.obtenerInfoDeProductoPorId);
    // router.post('/insertar-info-envio', Users.insertarInfoEnvio); // Nueva ruta para insertar información de envío
    // router.post('/insertar-info-pago', Users.insertarInfoPago); // Nueva ruta para insertar información de pago

    router.get('/cantidad-productos', Comensal.obtenerCantidadProductos); 
    router.get('/info-producto1', Comensal.obtenerInfoDeProducto);    
    router.get('/info-producto/:id', Comensal.obtenerInfoDeProductoPorId);
    router.get('/info-productoPorRestaurante/:id', Comensal.obtenerInfoProductoPorRestaurante);

    router.post('/crear-orden', Comensal.crearOrden); // Nueva ruta para insertar información de la orden general
    router.post('/crear-detalleOrden', Comensal.crearDetalleOrden); // Nueva ruta para insertar información de los productos de la orden
    router.delete('/eliminar-orden/:id', Comensal.eliminarOrden); // Nueva ruta para insertar eliminar la orden general si falla la funcion detalleOrden
    
    
    router.post('/insertar-info-pago', Comensal.insertarInfoPago); // Nueva ruta para insertar información de pago
    router.get('/obtener-cuentas/:id', Comensal.obtenerCuentas);
    router.post('/insertar-info-direccion', Comensal.insertarDireccion); // Nueva ruta para insertar información de direccion
    router.get('/obtener-direcciones/:id', Comensal.obtenerDirecciones); // Nueva ruta para ontener las direcciones a mostrar en el combo de cliente

    router.get('/info-detalleOrden', Comensal.obtenerInfoDetalleOrden);
    router.get('/info-ordenId/:id', Comensal.obtenerInfoOrdenId);
    router.get('/info-detalleOrdenId/:id', Comensal.obtenerInfoDetalleOrdenId); 

    router.get('/info-comensalId/:id', Comensal.obtenerInfocomensalId);
    router.get('/obtener-direcciones2/:id', Comensal.obtenerDirecciones2);
    router.get('/info-restauranteId/:id', Comensal.obtenerRestaurante); 
    router.get('/info-cuentaBancoId/:id', Comensal.obtenercuentaBancoId); 

    router.get('/obtener-ordenes/:id', Comensal.obtenerOrdenes);//Obtener las ordenes por el id de mi comensal

    router.post('/guardar-carrito/:id', Comensal.guardarCarrito); // Ruta para guardar la informacion del carrito
    router.put('/comensales/:comensalId/carrito/cantidad', Comensal.actualizarCantidad);
    router.put('/insertar-especificacion', Comensal.insertarEspecificacion);//ruta para insertar o actualizar la especificacion de un producto
    router.delete('/eliminar-de-carrito/:comensalId/:productId', Comensal.eliminarDeCarrito);
    router.put('/actualizar-carrito', Comensal.actualizarCarrito);
    router.post('/registrar-error', logs.registrarError);
    router.post('/registrar-transaccion', logs.registrarTransaccion);
    router.put('/ordenes/:id/:iDetalle/actualizarEstado', logs.actualizarEstado); 
    
    router.delete('/eliminar-producto-de-orden/:ordenId', logs.eliminarOrdenCompleta);
    router.put('/comensales/:orderId/noProductos', Comensal.actualizarCantidadProductos);
    router.put('/ordenes/:id/actualizarEstado', logs.actualizarEstado2); 

    //RUTAS UTILIZADAS POR LA SKILL DE ALEXA

    router.get('/restaurantes/nombres', User.obtenerRestaurantes);
    router.get('/restaurantes/nombresPorCategoria/:categoria', User.obtenerRestaurantesPorCategoria);
    router.get('/info-productosConOfertas/:id', User.obtenerInfoProductosConOfertas);
    router.post('/guardar-carritoSkill/:token', User.guardarCarritoSkill);
    router.get('/info-Carrito/:token', User.obtenerInfoCarrito);
    router.post('/guardar-carritoSkill/:token/:number', User.guardarCarritoSkill2);
    router.post('/guardar-carritoSkill2/:token/:cantidad', User.guardarCarritoSkill3);
    

}
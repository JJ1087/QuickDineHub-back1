const User = require('../models/auth.model');
const Product = require('../models/auth.modelMenu'); // Importa el modelo de productos
//Cambios de pruebas2

const jwt = require('jsonwebtoken'); //Se requiere el jsaon web token para las incriptaciones de contraseñas
const bcrypt = require('bcryptjs');
const secret_key = '123';
const mongoose = require("mongoose");

const Orden = require('../models/auth.modelOrden');
const DetalleOrden = require('../models/auth.modelDetalleOrden');
const Pago = require('../models/auth.modelCuentaBanco'); // Importa el modelo de pago
const Direccion = require('../models/auth.modelDireccion');
const Restaurante = require('../models/auth.modelrestaurante');


//Funcion para registrar a los usuarios en la BD
exports.createUser = async(req, res, next) => {
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: `El correo ${email} se encuentra registrado`,
            });
        }

        // Crear nuevo usuario
        const user = new User({
            nombre: req.body.nombreCompleto,
            email: req.body.correo,
            contraseña: bcrypt.hashSync(req.body.contrasena), //Encriptacion de contraseña con hash
            telefono: req.body.telefono,
            fechaNacimiento: req.body.fechaNacimiento
        });

        // Guardar el usuario en la base de datos
        await user.save();

        // Responder con éxito y el usuario creado
        res.status(201).json({ message: 'Usuario creado correctamente. Se ha enviado un correo de verificación.' });

    } catch (err) {
        // Manejar errores
        console.error(err);
        if (err.code === 11000) {
            return res.status(409).json({
                error: `El correo ${req.body.correo} ya está registrado en el sistema. Inicia sesión o utiliza un correo electrónico diferente.`
            });
        }
        res.status(500).json({ error: err.message });
    }
};

//------------------------------------------------------------------------------------------

// Recuperación de datos del formulario login
exports.loginUser = async(req, res, next) => {
    const userData = {
        email: req.body.email,
        password: req.body.password,
    };

    console.log('Lo que llego carnal: ', userData);

    try {
        // Buscar que el usuario exista en la BD
        const user = await User.findOne({ email: userData.email });

        if (!user) {
            res.status(409).send({ message: 'Datos G erróneos ingresados' }); //Buena practica, nunca especificar que dato es el incorrecto
        } else {
            // Comparación de contraseñas
            const isPasswordValid = await bcrypt.compare(userData.password, user.contraseña);

            if (isPasswordValid) {
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign({ id: user.id }, secret_key, { expiresIn: expiresIn });

                // Respuesta al frontend, datos que se muestran en consola, contraseña no por seguridad
                const dataUser = {
                    nombre: user.nombre,
                    email: user.email,
                    accessToken: accessToken,
                    expiresIn: expiresIn
                }

                res.send({ dataUser });


            } else {
                res.status(409).send({ message: 'Datos C erróneos ingresados' });
            }
        }
    } catch (error) {
        console.error('Error al autenticar el usuario TITE:', error);
        res.status(500).send('Error del servidor BROU :(' + error.message);
    }
};

//---------------------------Treaer datos para el Menu
// Obtener la cantidad de productos
exports.obtenerCantidadProductos = async(req, res, next) => {
    try {
        const productCount = await Product.countDocuments();
        console.log("Cantidad de productos encontrados:", productCount);

        res.status(200).json({ count: productCount });
    } catch (error) {
        console.error('Error al obtener la cantidad de productos:', error);
        res.status(500).json({ error: 'Error del servidor al obtener la cantidad de productos' });
    }
};

// Obtener la información de todos los productos
exports.obtenerInfoDeProducto = async(req, res, next) => {
    try {
        const products = await Product.find({}, { _id: 1, imagen: 1, nombre: 1, descripcion: 1, precio: 1, etiquetas: 1, timepoP: 1, categoria: 1, costoEnvio: 1, descuento: 1, oferta: 1, idRestaurante: 1 }); // Incluir el _id y los demás campos en la respuesta
        // Asegurémonos de que cada producto tenga el campo 'imagen' como un arreglo incluso si está vacío
        products.forEach(product => {
            if (!Array.isArray(product.imagen)) {
                product.imagen = [];
            }
        });
        res.status(200).json(products);
    } catch (error) {
        console.error('Error al obtener la información de los productos:', error);
        res.status(500).json({ error: 'Error del servidor al obtener la información de los productos' });
    }
};



// Obtener la información de un producto por su ID
const { ObjectId } = require('mongodb');

exports.obtenerInfoDeProductoPorId = async(req, res, next) => {
    try {
        const productId = req.params.id;

        console.log('lllega el id:',productId);
        const objectId = new ObjectId(productId);
        const product = await Product.findById(objectId);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error al obtener la información del producto:', error);
        res.status(500).json({ error: 'Error del servidor al obtener la información del producto' });
    }
};

exports.obtenerInfoProductoPorRestaurante = async (req, res, next) => {
    try {
        const idRestaurante = req.params.id; // Obtiene el ID del restaurante del parámetro de la solicitud

        console.log('ID del restaurante:', idRestaurante);

        // Busca todos los productos que coincidan con el ID del restaurante
        const productos = await Product.find({ idRestaurante: idRestaurante });

        if (!productos || productos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron productos para este restaurante' });
        }

        res.status(200).json(productos); // Devuelve los productos encontrados
    } catch (error) {
        console.error('Error al obtener la información de los productos:', error);
        res.status(500).json({ error: 'Error del servidor al obtener la información de los productos' });
    }
};


//-----------------------------CREAR UNA ORDEN--------------------

// Controlador para insertar información de envío
exports.crearOrden = async(req, res, next) => {
    try {
        console.log('Datos recibidos en el cuerpo de la solicitud:', req.body);
        const { idCliente, idRestaurante, idRepartidor, idDireccion, idCuentaBanco, estadoOrden, distancia, fechaHoraEntrega, noOrden, especificaciones, costoEnvio, precioTotal } = req.body; //
        const orden = new Orden({ idCliente, idRestaurante, idRepartidor, idDireccion, idCuentaBanco, estadoOrden, distancia, fechaHoraEntrega, noOrden, especificaciones, costoEnvio, precioTotal }); //
        const resultado = await orden.save();
        res.status(201).json(resultado);

        console.log('Orden creada');

    } catch (error) {
        console.error('Error al insertar información de Orden:', error);
        res.status(500).json({ error: 'Error del servidor al insertar información de Orden' });
    }
};

//-----------------------------CREAR Detalle de ORDEN--------------------

// Controlador para insertar información de envío
exports.crearDetalleOrden = async(req, res, next) => {
    try {
        console.log('Datos recibidos en el cuerpo de la solicitud:', req.body);
        const { idOrden, idProducto, nombreProducto, descripcionProducto, cantidadProducto, costoUnidad, subtotal, especificacion } = req.body; //
        const orden = new DetalleOrden({ idOrden, idProducto, nombreProducto, descripcionProducto, cantidadProducto, costoUnidad, subtotal, especificacion }); //
        const resultado = await orden.save();
        res.status(201).json(resultado);

        console.log('detalleOrden creada');

    } catch (error) {
        console.error('Error al insertar información detalleOrden:', error);
        res.status(500).json({ error: 'Error del servidor al insertar detalleOrden' });
    }
};

//------------------------------ELIMINAR UNA ORDEN-------------------------------------------------

// Controlador para eliminar una orden
exports.eliminarOrden = async(req, res, next) => {
    try {
        const orderId = req.params.id; // Obtener el ID de la orden de los parámetros de la URL
        console.log('Id a buscar en back1: ', orderId);
        const resultado = await Orden.findByIdAndDelete(orderId); // Buscar y eliminar la orden por su ID
        if (!resultado) {
            // Si no se encuentra la orden, devolver un error 404
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
        // Devolver una respuesta exitosa
        res.status(200).json({ message: 'Orden eliminada correctamente' });
    } catch (error) {
        // Manejar errores
        console.error('Error al eliminar la orden:', error);
        res.status(500).json({ error: 'Error del servidor al eliminar la orden' });
    }
};


// Controlador para insertar información de pago-------------------------------------------------------------------------------------------

exports.insertarInfoPago = async(req, res, next) => {
    try {
        const { idCliente, noTarjeta, nombreTitular, fechaVencimiento, cvv } = req.body;
        const pago = new Pago({ idCliente, noTarjeta, nombreTitular, fechaVencimiento, cvv });
        const resultado = await pago.save();
        res.status(201).json(resultado);
    } catch (error) {
        console.error('Error al insertar información de cuentaBancaria:', error);
        res.status(500).json({ error: 'Error del servidor al insertar información de cuentaBancaria' });
    }
};

// Devolver las cuentas del comensal para mostrar en el combo
exports.obtenerCuentas = async(req, res, next) => {
    try {
        const idCliente = req.params.id;
        const cuentas = await Pago.find({ idCliente: idCliente });

        if (cuentas.length === 0) {
            return res.status(404).json({ error: 'Cuentas no encontradas' });
        }

        res.status(200).json(cuentas);
    } catch (error) {
        console.error('Error al obtener las cuentas:', error);
        res.status(500).json({ error: 'Error del servidor al obtener las cuentas' });
    }
};

//----------------------------------------------------LOGICA DE DIRECCIONES-------------------------------------
// Controlador para insertar información de direccion
exports.insertarDireccion = async(req, res, next) => {
    try {
        const { idCliente, cp, ciudad, colonia, calle, noCasa, datoExtra } = req.body;
        const direccion = new Direccion({ idCliente, cp, ciudad, colonia, calle, noCasa, datoExtra });
        const resultado = await direccion.save();
        res.status(201).json(resultado);
    } catch (error) {
        console.error('Error al insertar información de direccion:', error);
        res.status(500).json({ error: 'Error del servidor al insertar información de direccion' });
    }
};

// Devolver las direcciones del comensal para mostrar en el combo
exports.obtenerDirecciones = async(req, res, next) => {
    try {
        const idCliente = req.params.id;
        const direcciones = await Direccion.find({ idCliente: idCliente });

        if (direcciones.length === 0) {
            return res.status(404).json({ error: 'Direcciones no encontradas' });
        }

        res.status(200).json(direcciones);
    } catch (error) {
        console.error('Error al obtener las direcciones:', error);
        res.status(500).json({ error: 'Error del servidor al obtener las direcciones' });
    }
};

//----------Mis Pedidos-------------------------------------------------------------------

exports.obtenerInfoDetalleOrden = async(req, res, next) => {
    try {
        const detalleOrdenes = await DetalleOrden.find({}, { _id: 1, idOrden: 1, idProducto: 1, nombreProducto: 1, descripcionProducto: 1, cantidadProducto: 1, costoUnidad: 1, subtotal: 1 }); // Obtener detalles de orden por el ID de la orden

        res.status(200).json(detalleOrdenes);
    } catch (error) {
        console.error('Error al obtener los detalles de las órdenes:', error);
        res.status(500).json({ error: 'Error del servidor al obtener los detalles de las órdenes' });
    }
};



exports.obtenerInfoOrdenId = async(req, res, next) => {
    try {
        const orderId = req.params.id;
        const objectId = new ObjectId(orderId);
        const order = await Orden.findById(objectId);
        if (!order) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error al obtener la información de la orden:', error);
        res.status(500).json({ error: 'Error del servidor al obtener la información de la orden' });
    }
};


exports.obtenerInfoDetalleOrdenId = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const objectId = new ObjectId(orderId);

    console.log("ID DETALLE", objectId);
    const order = await DetalleOrden.findById(objectId);
    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error al obtener la información de la orden:', error);
    res.status(500).json({ error: 'Error del servidor al obtener la información de la orden' });
  }
};

//-------Estado-Envio----------------------------------------------------------------------------------

exports.obtenerInfocomensalId = async(req, res, next) => {
    try {
        const orderId = req.params.id;
        const objectId = new ObjectId(orderId);
        const order = await User.findById(objectId);
        if (!order) {
            return res.status(404).json({ error: 'Comensal no encontrado' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error al obtener la información del comensal:', error);
        res.status(500).json({ error: 'Error del servidor al obtener la información del comensal' });
    }
};

exports.obtenerDirecciones2 = async(req, res, next) => {
    try {
        const orderId = req.params.id;
        const objectId = new ObjectId(orderId);
        const order = await Direccion.findById(objectId);
        if (!order) {
            return res.status(404).json({ error: 'Comensal no encontrado' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error al obtener la información del comensal:', error);
        res.status(500).json({ error: 'Error del servidor al obtener la información del comensal' });
    }
};

exports.obtenerRestaurante = async(req, res, next) => {
    try {
        const orderId = req.params.id;
        const objectId = new ObjectId(orderId);
        const order = await Restaurante.findById(objectId);
        if (!order) {
            return res.status(404).json({ error: 'Comensal no encontrado' });
        }
        res.status(200).json(order);
        console.log('DATOS', order)
    } catch (error) {
        console.error('Error al obtener la información del comensal:', error);
        res.status(500).json({ error: 'Error del servidor al obtener la información del comensal' });
    }
};

exports.obtenercuentaBancoId = async(req, res, next) => {
    try {
        const orderId = req.params.id;
        const objectId = new ObjectId(orderId);
        const order = await Pago.findById(objectId);
        if (!order) {
            return res.status(404).json({ error: 'Cuenta no encontrada' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error al obtener la información de cuenta:', error);
        res.status(500).json({ error: 'Error del servidor al obtener la información de cuenta' });
    }
};


//NOTIFICACIONES-------------------------------------------------------------------------
// Devolver las ORDENES del comensal para analizar si alguno necesita notificarse
exports.obtenerOrdenes = async(req, res, next) => {
    try {
        const idCliente = req.params.id;
        const direcciones = await Orden.find({ idCliente: idCliente });

        if (direcciones.length === 0) {
            return res.status(404).json({ error: 'Direcciones no encontradas' });
        }

        res.status(200).json(direcciones);
    } catch (error) {
        console.error('Error al obtener las direcciones:', error);
        res.status(500).json({ error: 'Error del servidor al obtener las direcciones' });
    }
};
//------------------------Carrito Compras------------------------------------------------------------

exports.guardarCarrito = async(req, res, next) => {
    try {
        const comensalId = req.params.id; // Obtener el ID del comensal de los parámetros de la URL
        const { carrito } = req.body; // Obtener el carrito del cuerpo de la solicitud

        // Buscar al comensal por su ID
        const comensal = await User.findById(comensalId);

        if (!comensal) {
            return res.status(404).json({ error: 'Comensal no encontrado' });
        }
        // Verificar si todos los elementos del carrito tienen un ID de restaurante válido
        if (carrito.some(item => !item.idRestaurante)) {
            return res.status(400).json({ error: 'El ID del restaurante es obligatorio para todos los elementos del carrito' });
        }

        console.log("Lo que llega al Back: ", comensal);

        // Actualizar el carrito del comensal con el nuevo arreglo
        // Iterar sobre los elementos del nuevo carrito
        carrito.forEach(item => {
            // Buscar el índice del producto en el carrito actual
            const index = comensal.carrito.findIndex(existingItem => String(existingItem.productId) === String(item.productId));
            if (index !== -1) {
                // Si el producto ya está en el carrito, actualizar sus propiedades
                comensal.carrito[index].cantidad = item.cantidad;
                comensal.carrito[index].especificacion = item.especificacion;
            } else {
                // Si el producto no está en el carrito, agregarlo
                comensal.carrito.push({ productId: item.productId, idRestaurante: item.idRestaurante, cantidad: item.cantidad, especificacion: item.especificacion });
            }
        });

        console.log("COMO SALE EN Back: ", comensal);


        // Guardar los cambios en la base de datos
        await comensal.save();

        console.log("COMO SALE EN Back SAVE: ", comensal);

        // Enviar una respuesta de éxito
        res.status(200).json({ message: 'Carrito guardado exitosamente' });
    } catch (error) {
        // Manejar errores
        console.error('Error al guardar el carrito:', error);
        res.status(500).json({ error: 'Error del servidor al guardar el carrito' });
    }

};

exports.actualizarCantidad = async(req, res, next) => {
    try {
        const comensalId = req.params.comensalId; // Obtener el ID del comensal de los parámetros de la URL
        const { productId, cantidad } = req.body; // Obtener el productId y la nueva cantidad del cuerpo de la solicitud
        console.log("ID recibido para cambiar el carrito: ", productId);

        // Buscar al comensal por su ID
        const comensales = await User.findById(comensalId);

        console.log("carrito: ", comensales.carrito);

        if (!comensales) {
            return res.status(404).json({ error: 'Comensal no encontrado' });
        }
        console.log("Comensal encontrado ");
        // Buscar el producto en el carrito del comensal
        //const productoIndex = comensales.carrito.findIndex(item => item.productId === productId);
        // Buscar el producto en el carrito del comensal
        const productoIndex = comensales.carrito.findIndex(item => String(item.productId) === productId);

        if (productoIndex === -1) {
            console.log("Producto no encontrado en el carrito ");
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
        console.log("Producto encontrado en el carrito ");
        // Actualizar la cantidad del producto
        comensales.carrito[productoIndex].cantidad = cantidad;
        console.log("Cantidad actualizada");

        // Guardar los cambios en la base de datos
        await comensales.save();
        console.log("Todo guardado compa");
        // Enviar una respuesta de éxito
        res.status(200).json({ message: 'Cantidad de producto actualizada exitosamente' });
    } catch (error) {
        // Manejar errores
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ error: 'Error del servidor al actualizar la cantidad del producto en el carrito' });
    }
};

exports.insertarEspecificacion = async(req, res, next) => {
    try {
        const { especificacion, idCliente, idProducto, } = req.body;

        // Buscar al comensal por su ID
        const comensal = await User.findById(idCliente);

        if (!comensal) {
            return res.status(404).json({ error: 'Comensal no encontrado' });
        }
        console.log("Comensal encontrado");

        // Buscar el producto en el carrito del comensal
        const productoIndex = comensal.carrito.findIndex(item => String(item.productId) === idProducto);

        if (productoIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
        console.log("Producto encontrado");
        // Actualizar la especificación del producto
        comensal.carrito[productoIndex].especificacion = especificacion;

        // Guardar los cambios en la base de datos
        await comensal.save();

        // Enviar una respuesta de éxito
        res.status(200).json({ message: 'Especificación de producto actualizada exitosamente' });
    } catch (error) {
        // Manejar errores
        console.error('Error al insertar la especificación del producto en el carrito:', error);
        res.status(500).json({ error: 'Error del servidor al insertar la especificación del producto en el carrito' });
    }
};

exports.eliminarDeCarrito = async(req, res, next) => {
    try {
        const { comensalId, productId } = req.params; // Obtener el ID del comensal y del producto de los parámetros de la URL

        // Buscar al comensal por su ID
        const comensal = await User.findById(comensalId);

        if (!comensal) {
            return res.status(404).json({ error: 'Comensal no encontrado' });
        }

        // Buscar el producto en el carrito del comensal
        const productoIndex = comensal.carrito.findIndex(item => String(item.productId) === productId);

        if (productoIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        console.log('Antes de eliminar de carrito:', comensal);
        // Eliminar el producto del carrito
        comensal.carrito.splice(productoIndex, 1);

        console.log('Despues de eliminar de carrito:', comensal);

        // Guardar los cambios en la base de datos
        await comensal.save();

        // Enviar una respuesta de éxito
        res.status(200).json({ message: 'Producto eliminado del carrito exitosamente' });
    } catch (error) {
        // Manejar errores
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: 'Error del servidor al eliminar producto del carrito' });
    }
};

exports.actualizarCarrito = async(req, res, next) => {
    try {
        const { comensalId } = req.body; // Obtener el ID del comensal de los parámetros de la solicitud
        const { carrito } = req.body; // Obtener el carrito actualizado de los parámetros de la solicitud

        // Buscar al comensal por su ID
        const comensal = await User.findById(comensalId);

        if (!comensal) {
            return res.status(404).json({ error: 'Comensal no encontrado' });
        }

        // Actualizar el carrito del comensal con el nuevo carrito recibido
        comensal.carrito = carrito;

        // Guardar los cambios en la base de datos
        await comensal.save();

        // Enviar una respuesta de éxito
        res.status(200).json({ message: 'Carrito actualizado exitosamente' });
    } catch (error) {
        // Manejar errores
        console.error('Error al actualizar carrito:', error);
        res.status(500).json({ error: 'Error del servidor al actualizar carrito' });
    }
};

exports.actualizarCantidadProductos = async(req, res, next) => {
    try {
        const orderId = req.params.orderId; // Obtener el ID del comensal de los parámetros de la URL
        const { noProductos1 } = req.body; // Obtener el productId y la nueva cantidad del cuerpo de la solicitud
        console.log("ID recibido para cambiar el carrito: ", orderId);

        // Buscar al comensal por su ID
        const Orden1 = await Orden.findById(orderId);

        console.log("comensal: ", Orden1);

        if (!Orden1) {
            return res.status(404).json({ error: 'Orden no encontrada' });
        }
        console.log("Orden encontrada ");

        // Actualizar la cantidad del producto
        Orden1.noProductos = noProductos1;
        console.log("Cantidad actualizada");

        // Guardar los cambios en la base de datos
        await Orden1.save();
        console.log("Todo guardado compa");
        // Enviar una respuesta de éxito
        res.status(200).json({ message: 'Cantidad de producto actualizada exitosamente' });
    } catch (error) {
        // Manejar errores
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ error: 'Error del servidor al actualizar la cantidad del producto en el carrito' });
    }
};
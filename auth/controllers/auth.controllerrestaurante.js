const userRestaurante = require('../models/auth.modelrestaurante');
const Ordenes = require('../models/auth.modelOrden');
const Cliente = require('../models/auth.model');
const Detalle = require('../models/auth.modelDetalleOrden');
const DatoDireccion = require('../models/auth.modelDireccion');

const jwt = require('jsonwebtoken'); //Se requiere eljsaon web token para las incriptaciones de contraseñas
const bcrypt = require('bcryptjs');
const secret_key = '4^B@!eD57Rm#6LjP';
const mongoose = require('mongoose');
//Funcion para registrar a los restaurantes en la BD
exports.createUserRes = async(req, res, next) => {

    try {
        console.log('Datos recibidos del Front:', req.body);
        const { correoRestaurante } = req.body;
        const existingUser = await userRestaurante.findOne({ correoRestaurante });
        if (existingUser) {
            return res.status(409).json({
                message: ` El correo ${ correoRestaurante } ya está registrado `,
            });
        }

        // Crear nuevo usuario
        const userRestaurant = new userRestaurante({
            _id: new mongoose.Types.ObjectId(),
            nombreRestaurante: req.body.nombreRestaurante,
            correoRestaurante: req.body.correoRestaurante,
            telefonoRestaurante: req.body.telefonoRestaurante,
            encargadoRestaurante: req.body.encargadoRestaurante,
            apellidoEncargado: req.body.apellidoEncargado,
            direccionRestaurante: req.body.direccionRestaurante,
            contrasena: bcrypt.hashSync(req.body.contrasena), //Encriptacion de contraseña con hash
            numeroRestaurante: req.body.numeroRestaurante,
            razonSocial: req.body.razonSocial,
            domicilioFiscal: req.body.domicilioFiscal,
            nombreTitular: req.body.nombreTitular,
            direccion: req.body.direccion,
            ciudad: req.body.ciudad,
            codigoPostal: req.body.codigoPostal,
            numeroCLABE: req.body.numeroCLABE,
            numeroPreguntaSecreta: req.body.numeroPreguntaSecreta,
            respuestaSecreta: req.body.respuestaSecreta,
            menuImagen: req.files['menuImagen'][0].path, // Guardar la ruta de la imagen de menu
            identificacionOficial: req.files['identificacionOficial'][0].path, // Guardar la ruta de la imagen de identificacionOficial
            constanciaFiscal: req.files['constanciaFiscal'][0].path, // Guardar la ruta de la imagen de constanciaFiscal
            estadoCuentaBancaria: req.files['estadoCuentaBancaria'][0].path, // Guardar la ruta de la imagen de estadoCuentaBancaria
            licenciaFuncionamiento: req.files['licenciaFuncionamiento'][0].path, // Guardar la ruta de la imagen de licenciaFuncionamiento
            estadoPerfil: '1',
            rol: 'restaurante',
        });
        console.log('Lo que llego carnal: ', userRestaurant);

        // Guardar el usuario en la base de datos
        await userRestaurant.save();

        // Responder con éxito y el usuario creado
        res.status(201).json({ message: 'Usuario creado correctamente. Se ha enviado un correo de verificación.' });

    } catch (err) {
        // Manejar errores
        console.error(err);
        res.status(500).json({ error: 'Ocurrió un error al crear el usuario.' });
    }
};

// Recuperación de datos del formulario login
exports.loginRes = async(req, res, next) => {
    const userRes = {
        nombreRestaurante: req.body.nombreRestaurante,
        correoRestaurante: req.body.correoRestaurante,
        contrasena: req.body.contrasena,
    };

    console.log('Lo que llego carnal: ', userRes);

    try {
        // Buscar que el usuario exista en la BD
        const userRestaurant = await userRestaurante.findOne({ nombreRestaurante: userRes.nombreRestaurante, correoRestaurante: userRes.correoRestaurante });

        if (!userRestaurant) {
            res.status(409).send({ message: 'Datos G erróneos ingresados' }); //Buena practica, nunca especificar que dato es el incorrecto
        } else {
            // Comparación de contraseñas
            const isPasswordValid = await bcrypt.compare(userRes.contrasena, userRestaurant.contrasena);

            if (isPasswordValid) {
                const timeExpires = 24 * 60 * 60 * 1000;
                const tiempoActualEnMilisegundos = new Date().getTime();
                const expiresIn = timeExpires + tiempoActualEnMilisegundos;
                const accessToken = jwt.sign({ id: userRestaurant.id, rol: userRestaurant.rol }, secret_key, { expiresIn: expiresIn });


                // Respuesta al frontend, datos que se muestran en consola, contraseña no por seguridad
                const dataRestaurant = {
                    id: userRestaurant._id,
                    nombreRestaurante: userRestaurant.nombreRestaurante,
                    correoRestaurante: userRestaurant.correoRestaurante,
                    rol: userRestaurant.rol,
                    accessToken: accessToken,
                    expiresIn: expiresIn
                }
                console.log(dataRestaurant)
                res.send({ dataRestaurant });


            } else {
                res.status(409).send({ message: 'Datos C erróneos ingresados' });
            }
        }
    } catch (error) {
        console.error('Error al autenticar el usuario :', error);
        res.status(500).send('Error del servidor:' + error.message);
    }
};

exports.obtenerPreguntaYRespuestaSecreta = async(req, res, next) => {
    try {
        const { email } = req.params;
        const usuario = await userRestaurante.findOne({ correoRestaurante: email }); // Cambiar 'correo' a 'email'

        if (usuario) {
            const preguntaSecreta = usuario.numeroPreguntaSecreta;
            const respuestaSecreta = usuario.respuestaSecreta;

            res.status(200).json({ preguntaSecreta, respuestaSecreta });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener la pregunta secreta y la respuesta secreta:', error);
        res.status(500).json({ error: 'Error del servidor al obtener la pregunta secreta y la respuesta secreta' });
    }
};

exports.cambiarContraseña = async(req, res, next) => {
    try {
        const { email, nuevaContraseña } = req.body;

        // Buscar al usuario en la base de datos por su correo electrónico
        const usuario = await userRestaurante.findOne({ correoRestaurante: email });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Encriptar la nueva contraseña antes de guardarla en la base de datos
        const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

        // Actualizar la contraseña del usuario
        usuario.contrasena = hashedPassword;
        await usuario.save();

        return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//PEDIDOS:

exports.mostrarpedido = async(req, res, next) => {
    console.log('lo que llegó del canal', req.params.restauranteId);
    try {
        // Obtener todos los pedidos de la base de datos para el restaurante específico
        const pedidos = await Ordenes.find({ idRestaurante: req.params.restauranteId });

        // Array para almacenar los pedidos con información adicional
        const pedidosConInfoAdicional = [];

        // Iterar sobre cada pedido para obtener información adicional
        for (const pedido of pedidos) {
            // Consultar el modelo de cliente para obtener los datos del cliente asociado al pedido
            const cliente = await Cliente.findById(pedido.idCliente);

            // Consultar el modelo de detalle para obtener los detalles de producto asociados al pedido
            const detallesOrden = await Detalle.find({ idOrden: pedido._id });
            // Consultar el modelo de detalle para obtener los detalles de producto asociados al pedido
            const MDireccion = await DatoDireccion.findById(pedido.idDireccion);

            // Array para almacenar los detalles de producto de este pedido
            const detallesProductos = [];


            // Iterar sobre cada detalle de producto para obtener información adicional
            for (const detalle of detallesOrden) {
                detallesProductos.push({
                    idDetalle: detalle._id,
                    idOrden: detalle.idOrden,
                    idProducto: detalle.idProducto,
                    nombreProducto: detalle.nombreProducto,
                    descripcionProducto: detalle.descripcionProducto,
                    cantidadProducto: detalle.cantidadProducto,
                    costoUnidad: detalle.cantidadProducto,
                });
            }



            // Construir el objeto de pedido con información adicional
            const pedidoConInfo = {
                _id: pedido._id,
                idCliente: pedido.idCliente,
                idRestaurante: pedido.idRestaurante,
                idRepartidor: pedido.idRepartidor,
                idDireccion: pedido.idDireccion,
                idCuentaBanco: pedido.idCuentaBanco,
                estadoOrden: pedido.estadoOrden,
                distancia: pedido.distancia,
                fechaPedido: pedido.createdAt,
                noOrden: pedido.noOrden,
                especificaciones: pedido.especificaciones,
                costoEnvio: pedido.costoEnvio,
                precioTotal: pedido.precioTotal,
                nombreCliente: cliente ? cliente.nombre : "Cliente no encontrado",
                //direccion: 
                cp: MDireccion.cp,
                ciudad: MDireccion.ciudad,
                colonia: MDireccion.colonia,
                calle: MDireccion.calle,
                noCasa: MDireccion.noCasa,
                datoExtra: MDireccion.datoExtra,
                //detallesProductos 
                detallesProductos: detallesProductos,

            };

            // Agregar el pedido con información adicional al array
            pedidosConInfoAdicional.push(pedidoConInfo);
        }

        // Responder con los pedidos con información adicional
        res.status(200).json(pedidosConInfoAdicional);
        console.log('PEDIDOS:', JSON.stringify(pedidosConInfoAdicional, null, 2));
    } catch (err) {
        // Manejar errores
        console.error(err);
        res.status(500).json({ error: 'ERROR INESPERADO' });
    }
}
exports.aceptarOrden = async(req, res, next) => {
    try {
        const { pedidoId } = req.params; // Obtener el ID del pedido de los parámetros de la solicitud

        // Actualizar el estado del pedido en la base de datos
        const pedidoActualizado = await Ordenes.findByIdAndUpdate(
            pedidoId, { estadoOrden: 4 }, // Actualizar el estado del pedido a "Aceptado"
            { new: true } // Para devolver el documento actualizado
        );

        if (!pedidoActualizado) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Responder con el pedido actualizado
        res.status(200).json({ message: 'Pedido aceptado correctamente', pedido: pedidoActualizado });
    } catch (error) {
        console.error('Error al aceptar el pedido:', error);
        res.status(500).json({ error: 'Error al aceptar el pedido' });
    }
};


exports.rechazarOrden = async(req, res, next) => {
    try {
        const { pedidoId } = req.params; // Obtener el ID del pedido de los parámetros de la solicitud

        // Actualizar el estado del pedido en la base de datos
        const pedidoActualizado = await Ordenes.findByIdAndUpdate(
            pedidoId, { estadoOrden: 1 }, // Actualizar el estado del pedido a "Aceptado"
            { new: true } // Para devolver el documento actualizado
        );

        if (!pedidoActualizado) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Responder con el pedido actualizado
        res.status(200).json({ message: 'Pedido aceptado correctamente', pedido: pedidoActualizado });
    } catch (error) {
        console.error('Error al aceptar el pedido:', error);
        res.status(500).json({ error: 'Error al aceptar el pedido' });
    }
};

exports.OrdenCompletada = async(req, res, next) => {
    try {
        const { pedidoId } = req.params; // Obtener el ID del pedido de los parámetros de la solicitud

        // Actualizar el estado del pedido en la base de datos
        const pedidoActualizado = await Ordenes.findByIdAndUpdate(
            pedidoId, { estadoOrden: 5 }, // Actualizar el estado del pedido a "Aceptado"
            { new: true } // Para devolver el documento actualizado
        );

        if (!pedidoActualizado) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Responder con el pedido actualizado
        res.status(200).json({ message: 'Pedido aceptado correctamente', pedido: pedidoActualizado });
    } catch (error) {
        console.error('Error al aceptar el pedido:', error);
        res.status(500).json({ error: 'Error al aceptar el pedido' });
    }
};

exports.OrdenEnvio = async(req, res, next) => {
    try {
        const { pedidoId } = req.params; // Obtener el ID del pedido de los parámetros de la solicitud

        // Actualizar el estado del pedido en la base de datos
        const pedidoActualizado = await Ordenes.findByIdAndUpdate(
            pedidoId, { estadoOrden: 6 }, // Actualizar el estado del pedido a "Aceptado"
            { new: true } // Para devolver el documento actualizado
        );

        if (!pedidoActualizado) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Responder con el pedido actualizado
        res.status(200).json({ message: 'Pedido aceptado correctamente', pedido: pedidoActualizado });
    } catch (error) {
        console.error('Error al aceptar el pedido:', error);
        res.status(500).json({ error: 'Error al aceptar el pedido' });
    }


};

exports.cancelarProducto = async(req, res, next) => {
    try {
        const { pedidoId } = req.params; // Obtener el ID del pedido de los parámetros de la solicitud
        const ParametroProductoCancelado = req.body; // Obtener la información del producto cancelado del cuerpo de la solicitud
        console.log('PARAMETRO', req.params);
        console.log('EL BODY', req.body);
        console.log('EL PRODUCTO', ParametroProductoCancelado);

        // Buscar el pedido por su ID
        const pedido = await Ordenes.findById(pedidoId);

        if (!pedido) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Actualizar la información del pedido con el producto cancelado
        pedido.productoCancelado = ParametroProductoCancelado;

        // Actualizar el estado del pedido a "En Espera"
        pedido.estadoOrden = 2;

        // Guardar los cambios en la base de datos
        await pedido.save();

        // Responder con el pedido actualizado
        res.status(200).json({ message: 'Producto cancelado correctamente', pedido });
    } catch (error) {
        console.error('Error al cancelar el producto del pedido:', error);
        res.status(500).json({ error: 'Error al cancelar el producto del pedido' });
    }
};
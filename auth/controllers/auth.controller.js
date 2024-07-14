const User = require('../models/auth.model');
const Product = require('../models/auth.modelMenu'); // Importa el modelo de productos
const jwt = require('jsonwebtoken'); //Se requiere el jsaon web token para las incriptaciones de contraseñas
const bcrypt = require('bcryptjs');
const secret_key = '4^B@!eD57Rm#6LjP'; //IMPORTANTISIMO METER CLAVE EN UNA .ENV LO MISMO TUS CREDENCIALES EN BD
const mongoose = require("mongoose");
const Envio = require('../models/auth.modelInfoEnvio'); // Importa el modelo de envío
const Pago = require('../models/auth.modelInfoPago'); // Importa el modelo de pago
const logacceso = require('../models/logs-Acceso'); //log acceso
const Restaurant = require('../models/auth.modelrestaurante');
//Funcion para registrar a los usuarios en la BD
exports.createUser = async(req, res, next) => {
    console.log('Datos recibidos del Front:', req.body);
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
            fechaNacimiento: req.body.fechaNacimiento,
            preguntaSecreta: req.body.preguntaSecreta,
            respuestaSecreta: req.body.respuestaSecreta,
            estadoPerfil: '1',
            rol: 'comensal',

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
        const user = await User.findOne({ email: userData.email });

        if (!user) {
            res.status(409).send({ message: 'NO EXISTE USUARIO' });
        } else {
            const isPasswordValid = await bcrypt.compare(userData.password, user.contraseña);

            if (isPasswordValid) {
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign({ id: user.id, rol: user.rol }, secret_key, { expiresIn: expiresIn });

                const dataUser = {
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol,
                    id: user._id,
                    accessToken: accessToken,
                    expiresIn: expiresIn
                }

                const nuevoAccesoLog = new logacceso({
                    user_id: user._id,
                    email: userData.email,
                    inicioSesion: new Date(),
                    intentosFallidos: 0
                });

                await nuevoAccesoLog.save();
                console.log(accessToken);

                res.send({ dataUser });
            } else {
                const datoUser = {
                    email: user.email,
                }
                res.status(409).send({ message: 'EXISTE USUARIO: CONTRASEÑA INCORRECTA', datoUser });
            }
        }
    } catch (error) {
        console.error('Error al autenticar el usuario:', error);
        res.status(500).send('Error del servidor: ' + error.message);
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
        const products = await Product.find({}, { _id: 1, imagen: 1, nombre: 1, descripcion: 1, precio: 1, etiquetas: 1, timepoP: 1 }); // Incluir el _id y los demás campos en la respuesta
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
        const objectId = new ObjectId(productId);
        const product = await Product.findById(objectId); //
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error al obtener la información del producto:', error);
        res.status(500).json({ error: 'Error del servidor al obtener la información del producto' });
    }
};

//-----------------------------Proceso de Peticion de platillo--------------------

// Controlador para insertar información de envío
exports.insertarInfoEnvio = async(req, res, next) => {
    try {
        console.log('Datos recibidos en el cuerpo de la solicitud:', req.body);
        const { nombre, direccion, ciudad, codigoPostal, descripcionProducto } = req.body;
        const envio = new Envio({ nombre, direccion, ciudad, codigoPostal, descripcionProducto });
        const resultado = await envio.save();
        res.status(201).json(resultado);
    } catch (error) {
        console.error('Error al insertar información de envío:', error);
        res.status(500).json({ error: 'Error del servidor al insertar información de envío' });
    }
};

// Controlador para insertar información de pago
exports.insertarInfoPago = async(req, res, next) => {
    try {
        const { tipoPago, noTarjeta, expiracion, cvv } = req.body;
        const pago = new Pago({ tipoPago, noTarjeta, expiracion, cvv });
        const resultado = await pago.save();
        res.status(201).json(resultado);
    } catch (error) {
        console.error('Error al insertar información de pago:', error);
        res.status(500).json({ error: 'Error del servidor al insertar información de pago' });
    }
};

exports.obtenerPreguntaYRespuestaSecreta = async(req, res, next) => {
    try {
        const { email } = req.params;
        const usuario = await User.findOne({ email: email }); // Cambiar 'correo' a 'email'

        if (usuario) {
            const preguntaSecreta = usuario.preguntaSecreta;
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
        const usuario = await User.findOne({ email: email });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Encriptar la nueva contraseña antes de guardarla en la base de datos
        const hashedPassword = await bcrypt.hash(nuevaContraseña, 10);

        // Actualizar la contraseña del usuario
        usuario.contraseña = hashedPassword;
        await usuario.save();

        return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

//Controladores usados por la skill Alexa----------------------------------------------------------------------

exports.obtenerRestaurantes = async (req, res) => {
    try {
      const restaurantes = await Restaurant.find({}); // Obtener todos los datos de los restaurantes
      res.status(200).json(restaurantes);//Pruebas para skill 2 
    } catch (error) {
      console.error('Error al obtener los restaurantes:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.obtenerRestaurantesPorCategoria = async (req, res, next) => {
    try {
        const categoria = req.params.categoria; // Obtiene el ID del restaurante del parámetro de la solicitud

        console.log('Categoria del restaurante:', categoria);

        // Busca todos los productos que coincidan con el ID del restaurante
        const productos = await Restaurant.find({ categoria: categoria });

        if (!productos || productos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron restaurantes con esta categoria' });
        }

        res.status(200).json(productos); // Devuelve los productos encontrados
    } catch (error) {
        console.error('Error al obtener los restaurantes:', error);
        res.status(500).json({ error: 'Error del servidor al obtener la información de los restaurantes' });
    }
};


exports.obtenerInfoProductosConOfertas = async (req, res, next) => {
    try {
        const idRestaurante = req.params.id; // Obtiene el ID del restaurante del parámetro de la solicitud

        console.log('ID del restaurante:', idRestaurante);

        // Busca todos los productos que coincidan con el ID del restaurante y cuyo valor de "oferta" no sea "sin oferta"
        const productos = await Product.find({ idRestaurante: idRestaurante, oferta: { $ne: 'null' } });

        if (!productos || productos.length === 0) {
            return res.status(404).json({ error: 'No se encontraron productos para este restaurante' });
        }

        res.status(200).json(productos); // Devuelve los productos encontrados
    } catch (error) {
        console.error('Error al obtener la información de los productos:', error);
        res.status(500).json({ error: 'Error del servidor al obtener la información de los productos' });
    }
};

exports.guardarCarritoSkill = async(req, res, next) => {
    try {
        const token = req.params.token; // Obtener el ID del comensal de los parámetros de la URL
        const { carrito } = req.body; // Obtener el carrito del cuerpo de la solicitud

        // Buscar al comensal por su token
        const comensal = await User.findOne({ token: token });

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
        //res.status(200).json({ message: 'Carrito guardado exitosamente' });

        // Enviar una respuesta de éxito
        res.status(200).json({ success: true, message: 'Carrito guardado exitosamente' });
    } catch (error) {
        // Manejar errores
        console.error('Error al guardar el carrito:', error);
        res.status(500).json({ error: 'Error del servidor al guardar el carrito' });
    }

};

exports.obtenerInfoCarrito = async (req, res, next) => {
    try {
        const token = req.params.token; // Obtiene el token del parámetro de la solicitud

        console.log('Token:', token);

        // Busca el usuario que coincide con el token
        const usuario = await User.findOne({ token: token });

        if (!usuario) {
            return res.status(404).json({ error: 'No se encontró el usuario con este token' });
        }

        res.status(200).json(usuario.carrito); // Devuelve el carrito del usuario encontrado
    } catch (error) {
        console.error('Error al obtener la información del carrito:', error);
        res.status(500).json({ error: 'Error del servidor al obtener la información del carrito' });
    }
};


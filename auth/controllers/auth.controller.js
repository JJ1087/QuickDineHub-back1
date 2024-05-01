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
    // Se obtienen los datos de usuario del cuerpo de la solicitud
    const userData = {
        email: req.body.email,
        password: req.body.password,
    };

    // Se imprime en la consola los datos del usuario recibidos
    console.log('Lo que llego carnal: ', userData);

    try {
        // Buscar que el usuario exista en la BD mediante el correo electrónico proporcionado
        const user = await User.findOne({ email: userData.email });

        // Si no se encuentra ningún usuario con el correo electrónico proporcionado, se envía un mensaje de error
        if (!user) {
            res.status(409).send({ message: 'NO EXISTE USUARIO' });
        } else {
            // Se compara la contraseña proporcionada con la contraseña almacenada en la base de datos
            const isPasswordValid = await bcrypt.compare(userData.password, user.contraseña);

            // Si la contraseña es válida, se genera un token de acceso JWT y se envía como respuesta al cliente
            if (isPasswordValid) {
                const expiresIn = 24 * 60 * 60;
                const accessToken = jwt.sign({ id: user.id, rol: user.rol }, secret_key, { expiresIn: expiresIn });

                // Se construye el objeto de datos del usuario a enviar al cliente
                const dataUser = {
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.rol,
                    id: user._id,
                    accessToken: accessToken,
                    expiresIn: expiresIn
                    
                }

                // Aquí creamos un nuevo documento de acceso exitoso
                const nuevoAccesoLog = new logacceso({
                    user_id: user._id,
                    email: userData.email,
                    inicioSesion: new Date(),
                    intentosFallidos: 0 // No hubo intentos fallidos en este inicio de sesión
                });

                await nuevoAccesoLog.save(); // Guardamos el registro de acceso exitoso en la base de datos


                // Se envía la respuesta con los datos del usuario
                res.send({ dataUser });
            } else {
                // Si la contraseña no es válida, se envía un mensaje de error indicando que la contraseña es incorrecta
                const datoUser = {
                    email: user.email,
                }
                res.status(409).send({ message: 'EXISTE USUARIO: CONTRASEÑA INCORRECTA', datoUser });
            }
        }
    } catch (error) {
        // Si ocurre un error durante el proceso de autenticación, se maneja y se envía como respuesta un mensaje de error genérico
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

exports.obtenerRestaurantes = async (req, res) => {
    try {
      const restaurantes = await Restaurant.find({}); // Obtener todos los datos de los restaurantes
      res.status(200).json(restaurantes);
    } catch (error) {
      console.error('Error al obtener los restaurantes:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
};


const userRepartidor = require('../models/auth.modelRepartidor');
const jwt = require('jsonwebtoken'); //Se requiere eljsaon web token para las incriptaciones de contraseñas
const bcrypt = require('bcryptjs');
const secret_key = '123';
const mongoose = require('mongoose');
//Funcion para registrar a los restaurantes en la BD
exports.createUserRep = async(req, res, next) => {

    try {
        console.log('Datos recibidos en el cuerpo de la solicitud:', req.body);
        const { correoRepartidor } = req.body;
        const existingUser = await userRepartidor.findOne({ correoRepartidor });
        if (existingUser) {
            return res.status(409).json({
                message: ` El correo ${ correoRepartidor } ya está registrado `,
            });
        }

        // Crear nuevo usuario
        const userRepartidors = new userRepartidor({
            _id: new mongoose.Types.ObjectId(),
            nombreRepartidor: req.body.nombreRepartidor,
            apellidoRepartidor: req.body.apellidoRepartidor,
            ciudadRepartidor: req.body.ciudadRepartidor,
            telefonoRepartidor: req.body.telefonoRepartidor,
            correoRepartidor: req.body.correoRepartidor,
            contrasena: bcrypt.hashSync(req.body.contrasena), //Encriptacion de contraseña con hash
            vehiculoMatricula: req.body.vehiculoMatricula,
            vehiculoMarca: req.body.vehiculoMarca,
            vehiculoModelo: req.body.vehiculoModelo,
            vehiculoAnio: req.body.vehiculoAnio,

            marcaMoto: req.body.marcaMoto,
            modeloMoto: req.body.modeloMoto,
            anioMoto: req.body.anioMoto,
            matriculaMoto: req.body.matriculaMoto,


            claveInterbancaria: req.body.claveInterbancaria,
            numeroPreguntaSecreta: req.body.numeroPreguntaSecreta,
            respuestaSecreta: req.body.respuestaSecreta,

            identificacionOficial: req.files['identificacionOficial'][0].path, // Guardar la ruta de la imagen de identificacionOficial
            LicenciaConducir: req.files['licencia'][0].path, // Guardar la ruta de la imagen de constanciaFiscal
            fotoPerfilIzquierda: req.files['fotoPerfilIzquierda'][0].path, // Guardar la ruta de la imagen de estadoCuentaBancaria
            fotoPerfilDerecha: req.files['fotoPerfilDerecha'][0].path, // Guardar la ruta de la imagen de licenciaFuncionamiento
            fotoPerfilFrontal: req.files['fotoPerfilFrontal'][0].path, // Guardar la ruta de la imagen de licenciaFuncionamiento

            estadoPerfil: '1',
            rol: 'repartidor'
        });
        console.log('Lo que llego carnal: ', userRepartidors);

        // Guardar el usuario en la base de datos
        await userRepartidors.save();

        // Responder con éxito y el usuario creado
        res.status(201).json({ message: 'Usuario creado correctamente. Se ha enviado un correo de verificación.' });

    } catch (err) {
        // Manejar errores
        console.error(err);
        res.status(500).json({ error: 'Ocurrió un error al crear el usuario.' });
    }
};

// Recuperación de datos del formulario login
exports.loginRep = async(req, res, next) => {
    const userRep = {

        correoRepartidor: req.body.correoRepartidor,
        contrasena: req.body.contrasena,
    };

    console.log('Lo que llego carnal: ', userRep);

    try {
        // Buscar que el usuario exista en la BD
        const userRepartidors = await userRepartidor.findOne({ correoRepartidor: userRep.correoRepartidor });

        if (!userRepartidors) {
            res.status(409).send({ message: 'Datos G erróneos ingresados' }); //Buena practica, nunca especificar que dato es el incorrecto
        } else {
            // Comparación de contraseñas
            const isPasswordValid = await bcrypt.compare(userRep.contrasena, userRepartidors.contrasena);

            if (isPasswordValid) {
                const timeExpires = 24 * 60 * 60 * 1000;
                const tiempoActualEnMilisegundos = new Date().getTime();
                const expiresIn = timeExpires + tiempoActualEnMilisegundos;
                const accessToken = jwt.sign({ id: userRepartidors.id, rol: userRepartidors.rol }, secret_key, { expiresIn: expiresIn });

                // Extracción de datos del restaurante
                // Respuesta al frontend, datos que se muestran en consola, contraseña no por seguridad
                const dataRepartidor = {
                    id: userRepartidors._id,
                    nombreRepartidor: userRepartidors.nombreRepartidor,
                    correoRepartidor: userRepartidors.correoRepartidor,
                    rol: userRepartidors.rol,
                    accessToken: accessToken,
                    expiresIn: expiresIn
                }
                console.log(dataRepartidor)
                res.send({ dataRepartidor });

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
        const usuario = await userRepartidor.findOne({ correoRepartidor: email });
    
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

exports.cambiarContraseña = async (req, res, next) => {
    try {
        const { email, nuevaContraseña } = req.body;

        // Buscar al usuario en la base de datos por su correo electrónico
        const usuario = await userRepartidor.findOne({ correoRepartidor: email });

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
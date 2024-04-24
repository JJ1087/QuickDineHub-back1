// Importa el modelo de log de autenticación
const AutenticacionLog = require('../models/logs-Autentificacion');
const ErrorLog = require('../models/logs-Error');
const TransaccionLog = require('../models/logs-Transacciones');

const Orden = require('../models/auth.modelOrden');
const User = require('../models/auth.model');
const logacceso = require('../models/logs-Acceso'); //log acceso
const detalleOrden = require('../models/auth.modelDetalleOrden'); 



// Controlador para agregar log de autenticación---------------------------------------------------------------
exports.agregarLogAutenticacion = async(req, res) => {
    try {
        // Recibe los datos del cuerpo de la solicitud
        const { userCorreo, tipoEdicion } = req.body;
        console.log('email:', userCorreo, 'edicion:', tipoEdicion);

        // Crea un nuevo registro de log de autenticación
        const nuevoLog = new AutenticacionLog({
            userCorreo,
            tipoEdicion
        });

        // Guarda el registro en la base de datos
        await nuevoLog.save();

        // Envía una respuesta de éxito
        res.status(200).json({ message: 'Registro de log de autenticación agregado con éxito' });
    } catch (error) {
        // Si hay un error, envía una respuesta de error
        console.error('Error al agregar el registro de log de autenticación:', error);
        res.status(500).json({ message: 'Error al agregar el registro de log de autenticación' });
    }
};

let contadorErrores = 0;
let mensaje = "";
exports.registrarError = async(req, res) => {
    try {
        // Recibe los datos del cuerpo de la solicitud
        const { errorDetails, errorType } = req.body;
        console.log('Detalles del error:', errorDetails, 'Tipo de error:', errorType);


        // Busca en la base de datos los dos errores más recientes con los mismos detalles
        const ultimosErrores = await ErrorLog.find({ errorDetails }).sort({ timestamp: -1 }).limit(3);

        if (ultimosErrores.length === 3) {

            contadorErrores++;
            mensaje = "";
            console.log("CONTADOR FUERA DE IF", contadorErrores);
            if (contadorErrores === 3) {

                mensaje = "Advertencia"
                contadorErrores = 0; // Reinicia el contador después de enviar la advertencia
                console.log("Entramos AL IF MAS PROFUNDO DEBEMOS REINICIAR", contadorErrores);
                //return;
            }
        }

        // Crea un nuevo registro de log de error
        const nuevoErrorLog = new ErrorLog({
            errorDetails,
            errorType
        });

        // Guarda el registro en la base de datos
        await nuevoErrorLog.save();

        // Envía una respuesta de éxito
        console.log("mensaje antes", mensaje);
        res.status(200).json({ message: 'Registro de log de error agregado con éxito', mensaje });
        console.log("mensajedespues", mensaje);
    } catch (error) {
        // Si hay un error, envía una respuesta de error
        console.error('Error al agregar el registro de log de error:', error);
        res.status(500).json({ message: 'Error al agregar el registro de log de error' });
    }
};


exports.registrarTransaccion = async(req, res) => {
    try {
        const { transactionType, ordenId, comensalId } = req.body;

        // Crea un nuevo registro de log de transacción
        const nuevaTransaccionLog = new TransaccionLog({
            transactionType,
            ordenId,
            comensalId
        });

        // Guarda el registro en la base de datos
        await nuevaTransaccionLog.save();

        // Envía una respuesta de éxito
        res.status(200).json({ message: 'Registro de transacción agregado con éxito' });
    } catch (error) {
        // Si hay un error, envía una respuesta de error
        console.error('Error al agregar el registro de transacción:', error);
        res.status(500).json({ message: 'Error al agregar el registro de transacción' });
    }
};

// LOG DE ACCESO Y FUERZA BRUTA---------------------------------------------------------------
const AccesoLog = require('../models/logs-Acceso'); // Importa el modelo de log de acceso

exports.actualizarIntentosFallidos = async(req, res) => {
    const { userEmail, intentosFallidos } = req.body;
    console.log('Editar:', userEmail);
    console.log('Nuevo contador de intentos fallidos:', intentosFallidos);

    try {
        // Encuentra el registro de log más reciente para el usuario
        const latestAccessLog = await AccesoLog.findOne({ email: userEmail }).sort({ createdAt: -1 });

        // Actualiza el contador de intentos fallidos
        latestAccessLog.intentosFallidos = intentosFallidos;

        // Guarda los cambios en el registro de log
        await latestAccessLog.save();

        // Envía una respuesta de éxito con el nuevo valor de intentosFallidos
        res.status(200).json({
            message: 'Contador de intentos fallidos actualizado correctamente',
            _id: latestAccessLog._id,
            intentosFallidos: latestAccessLog.intentosFallidos,
            inicioSesion: latestAccessLog.inicioSesion,
            user_id: latestAccessLog.user_id
        });
    } catch (error) {
        // Manejo de errores
        console.error('Error al actualizar los intentos fallidos:', error);
        res.status(500).json({ message: 'Error al actualizar los intentos fallidos' });
    }
};

exports.obtenerIntentosFallidos = async(req, res) => {
    const { userEmail } = req.query;

    try {
        // Encuentra el registro de log más reciente para el usuario
        const latestAccessLog = await AccesoLog.findOne({ email: userEmail }).sort({ createdAt: -1 });

        // Si no se encuentra el registro o no tiene intentos fallidos, devolver 0
        if (!latestAccessLog || !latestAccessLog.intentosFallidos) {
            return res.status(200).json({ intentosFallidos: 0 });
        }

        // Devolver el número de intentos fallidos
        res.status(200).json({ intentosFallidos: latestAccessLog.intentosFallidos });
    } catch (error) {
        // Manejo de errores
        console.error('Error al obtener los intentos fallidos:', error);
        res.status(500).json({ message: 'Error al obtener los intentos fallidos' });
    }
};

exports.actualizarEstado = async (req, res) => {
  try {
    const idOrden = req.params.id;
    const idDetalle = req.params.iDetalle;

    console.log("ID Orden:", idOrden);
    console.log("ID Detalle:", idDetalle);

    // Eliminar el detalle de orden correspondiente
    await detalleOrden.findByIdAndDelete(idDetalle);

    const orden = await Orden.findById(idOrden);

    if (!orden) {
      return res.status(404).json({ mensaje: 'Orden no encontrada' });
    }

    orden.estadoOrden = 3; // Actualizar el estado de la orden
    await orden.save();
    return res.status(200).json({ mensaje: 'Estado de la orden actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el estado de la orden:', error);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

//Funcion para eliminar la orden completa--------------------------------------------

exports.eliminarOrdenCompleta = async (req, res, next) => {
  try {
    
    const { ordenId } = req.params; // Obtener el ID de la orden de los parámetros de la URL
    console.log("Entramos a la funcion correcta: id: ", ordenId);
    // Eliminar los documentos de la colección detalleordenes que coincidan con el idOrden
    await detalleOrden.deleteMany({ idOrden: ordenId });

    console.log("Se eliminaron los detalles");

    // Buscar y eliminar el documento de la colección ordenes que coincida con el idOrden
    const ordenEliminada = await Orden.findOneAndDelete({ _id: ordenId });
    console.log("Se elimino la orden");

    if (!ordenEliminada) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    // Enviar una respuesta de éxito
    res.status(200).json({ message: 'Orden eliminada exitosamente' });
  } catch (error) {
    // Manejar errores
    console.error('Error al eliminar orden:', error);
    res.status(500).json({ error: 'Error del servidor al eliminar orden' });
  }
};
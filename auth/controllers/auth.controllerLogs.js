// Importa el modelo de log de autenticación
const AutenticacionLog = require('../models/logs-Autentificacion');
const ErrorLog = require('../models/logs-Error');




// Controlador para agregar log de autenticación---------------------------------------------------------------
exports.agregarLogAutenticacion = async (req, res) => {
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
exports.registrarError = async (req, res) => {
  try {
    // Recibe los datos del cuerpo de la solicitud
    const { errorDetails, errorType } = req.body;
    console.log('Detalles del error:', errorDetails, 'Tipo de error:', errorType);


    // Busca en la base de datos los dos errores más recientes con los mismos detalles
    const ultimosErrores = await ErrorLog.find({ errorDetails }).sort({ timestamp: -1 }).limit(3);

      if (ultimosErrores.length === 3) {

        contadorErrores++;
        mensaje ="";
        console.log("CONTADOR FUERA DE IF", contadorErrores); 
        if (contadorErrores === 3) {

        mensaje ="Advertencia"
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
    res.status(200).json({ message: 'Registro de log de error agregado con éxito', mensaje}); 
    console.log("mensajedespues", mensaje); 
  } catch (error) {
    // Si hay un error, envía una respuesta de error
    console.error('Error al agregar el registro de log de error:', error);
    res.status(500).json({ message: 'Error al agregar el registro de log de error' });
  }
};

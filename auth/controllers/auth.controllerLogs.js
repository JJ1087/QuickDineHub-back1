// Importa el modelo de log de autenticación
const AutenticacionLog = require('../models/logs-Autentificacion');

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

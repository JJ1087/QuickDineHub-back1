const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//especificaciones de tipo de datos
const userSchema = new Schema({

    _id: mongoose.Schema.Types.ObjectId,

    nombreRestaurante: { type: String, required: true, },
    correoRestaurante: { type: String, required: true, trim: true, unique: true },
    telefonoRestaurante: { type: Number, required: true, },
    encargadoRestaurante: { type: String, required: true, },
    apellidoEncargado: { type: String, required: true, },
    direccionRestaurante: { type: String, required: true, },
    contrasena: { type: String, required: true, trim: true },
    numeroRestaurante: { type: String, required: true, },
    razonSocial: { type: String, required: true, },
    domicilioFiscal: { type: String, required: true, },
    menuImagen: { type: String, required: true, },
    nombreTitular: { type: String, required: true, },
    direccion: { type: String, required: true, },
    ciudad: { type: String, required: true, },
    codigoPostal: { type: String, required: true, },
    numeroCLABE: { type: String, required: true, },
    numeroPreguntaSecreta: { type: String, required: true, },
    respuestaSecreta: { type: String, required: true, },
    //IMAGENES_ARCHIVOS
    identificacionOficial: { type: String, required: true, },
    constanciaFiscal: { type: String, required: true, },
    estadoCuentaBancaria: { type: String, required: true, },
    licenciaFuncionamiento: { type: String, required: true, },
    estadoPerfil: { type: String, required: true, },
    rol: { type: String, required: true, },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('usuariorestaurante', userSchema)
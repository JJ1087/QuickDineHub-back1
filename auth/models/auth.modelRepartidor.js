const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//especificaciones de tipo de datos
const userSchema = new Schema({

    _id: mongoose.Schema.Types.ObjectId,

    nombreRepartidor: { type: String, required: true, },
    apellidoRepartidor: { type: String, required: true,},
    ciudadRepartidor: { type: String, required: true, },
    telefonoRepartidor: { type: Number, required: true, },
    correoRepartidor: { type: String, required: true, trim: true, unique: true},
    contrasena: { type: String, required: true, trim: true },
    vehiculoMatricula: { type: String, },
    vehiculoMarca: { type: String, },
    vehiculoModelo: { type: String, },
    vehiculoAnio: { type: String,  },
    marcaMoto: { type: String, },
    modeloMoto: { type: String, },
    anioMoto: { type: String, },
    matriculaMoto: { type: String,  },

    claveInterbancaria: { type: String, required: true, },
    numeroPreguntaSecreta: { type: String, required: true, },
    respuestaSecreta: { type: String, required: true, },

    //IMAGENES_ARCHIVOS
    identificacionOficial: { type: String, required: true, },
    LicenciaConducir: { type: String,  },
    fotoPerfilIzquierda: { type: String, required: true, },
    fotoPerfilDerecha: { type: String, required: true, },
    fotoPerfilFrontal: { type: String, required: true, },
    estadoPerfil: { type: String, required: true, },
    rol: {type: String, required: true,}
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('usuarioRepartidores', userSchema)
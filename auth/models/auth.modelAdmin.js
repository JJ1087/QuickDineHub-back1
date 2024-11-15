const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//especificaciones de tipo de datos
const adminSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true //gmail solo puede pertenecer a un usuario
    },
    contrasena: {
        type: String,
        required: true,
        trim: true//sin espacios en blanco
    },
    rol: {
        type: String,
        default: ""
    }
});

module.exports = mongoose.model('administradores', adminSchema)
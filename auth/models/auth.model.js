const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//especificaciones de tipo de datos
const userSchema = new Schema({
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
    contraseña: {
        type: String,
        required: true,
        trim: true//sin espacios en blanco
    },
    telefono: {
        type: Number,
        required: true,
        trim: true//sin espacios en blanco
    },
    respuestaSecreta: { type: String, required: true, },
    preguntaSecreta: { type: String, required: true, },
    estadoPerfil: { type: String, required: true, },
    rol: {type: String, required: true,},
    fechaNacimiento: {
        type: Date,
        required: true,
        // trim: true//sin espacios en blanco
    },
    carrito: {
        type: [{
            productId: {
                type: Schema.Types.ObjectId,
                required: true
            },
            idRestaurante: {
                type: Schema.Types.ObjectId,
                required: true
            },
            cantidad: {
                type: Number,
                default: 1
            },
            especificacion: {
                type: String,
                default: ""
            }
        }],
        default: [] // Valor por defecto: un arreglo vacío
    }
},{
    timestamps: true //guardar fecha de creacion y actualizacion de cuentas de usuario "NO REPUDIO"

});

module.exports = mongoose.model('comensales', userSchema)
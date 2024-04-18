const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Decimal128 } = require('mongoose');

//especificaciones de tipo de datos
const menuSchema = new Schema({

    _id: mongoose.Schema.Types.ObjectId,
    idRestaurante: { type: Schema.Types.ObjectId, ref: 'usuariorestaurantes', required: true },
    imagen: { type: [String], required: true, },
    nombre: { type: String, required: true, },
    descripcion: { type: String, required: true, },
    categoria: { type: String, required: true, },
    tiempoP: { type: Number, required: true, },
    precio: { type: Decimal128, required: true, trim: true },
    etiquetas: { type: [String], required: true, },
    oferta: { type: String },
    costoEnvio: { type: Decimal128 },
    descuento: { type: Decimal128 }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('productos', menuSchema)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Decimal128 } = require('mongoose');

//especificaciones de tipo de datos
const OfertaSchema = new Schema({

    _id: mongoose.Schema.Types.ObjectId,
    idRestaurante: { type: Schema.Types.ObjectId, ref: 'usuariorestaurantes', required: true },
    nombrerestaurante:{ type: String, required: true },
    imagen: { type: [String], required: true, },
    titulo: { type: String, required: true, },
    descripcion: { type: String, required: true, },
    TipoOferta: { type: String, required: true, },
    precioOriginal: { type: Decimal128, required: true,},
    precioOferta: { type: Decimal128, required: true,},
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('ofertas', OfertaSchema)

      
    
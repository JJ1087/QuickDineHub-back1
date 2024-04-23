const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = require('mongoose');
const { Decimal128 } = require('mongoose');

//especificaciones de tipo de datos
const ordenSchema = new Schema({
    idCliente: { type: ObjectId, required: true, },
    idRestaurante: { type: ObjectId, required: true, },
    idRepartidor: { type: ObjectId, required: true, },
    idDireccion: { type: ObjectId, required: true, },
    idCuentaBanco: { type: ObjectId, required: true, },

    estadoOrden: { type: Number, default: 0, },
    distancia: { type: Number, default: 0.00, },
    fechaHoraEntrega: { type: Date, default: '1010-01-01' },
    noOrden: { type: Number, default: 0, },

    especificaciones: { type: String, },
    costoEnvio: { type: Decimal128, required: true, },
    precioTotal: { type: Decimal128, required: true, },
    productoCancelado: [{ idDetalle: String, idProducto: String, nombreProducto: String }],
    noProductos: { type: Number, default: 1 },

}, {
    timestamps: true //guardar fecha y hora de solicitud del pedido

});

module.exports = mongoose.model('ordenes', ordenSchema)
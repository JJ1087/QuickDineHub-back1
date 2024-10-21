const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comprasRealizadasSchema = new Schema({
    idPedido: { type: Schema.Types.ObjectId, required: true },
    idCliente: { type: Schema.Types.ObjectId, required: true },
    idRestaurante: { type: Schema.Types.ObjectId, required: true },
    nombreProducto: { type: String, required: true },
    cantidadProducto: { type: Number, required: true },
    precioTotal: { type: mongoose.Types.Decimal128, required: true },
    fechaHoraEntrega: { type: Date, required: true },
    direccion: { type: String, required: true },
}, {
    timestamps: true // Para guardar la fecha y hora de creación y actualización
});

module.exports = mongoose.model('comprasRealizadas', comprasRealizadasSchema);
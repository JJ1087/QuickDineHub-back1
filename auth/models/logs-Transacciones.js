const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = require('mongoose');


const transactionLogSchema = new Schema({
    transactionType: { type: String, required: true }, // Tipo de transacción (por ejemplo: "pedido", "rechazo_pedido", "cancelacion_producto", etc.)
    ordenId: { type: Schema.Types.ObjectId, required: true }, // ID del pedido relacionado
    comensalId: { type: Schema.Types.ObjectId, required: true }, // ID del cliente
    timestamp: { type: Date, default: Date.now }, // Fecha y hora de la transacción
});

module.exports = mongoose.model('transaccionesLogs', transactionLogSchema);

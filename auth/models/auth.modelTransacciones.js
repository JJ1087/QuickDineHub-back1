const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//especificaciones de tipo de datos
const transaccionSchema = new Schema({
    tipoTransaccion: {
        type: String,
        required: true,
    },
    monto: {
        type: Number,
        required: true,
    },
    fechaDeTransaccion: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('transacciones', transaccionSchema)
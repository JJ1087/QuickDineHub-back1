const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//especificaciones de tipo de datos
const infoPagoSchema = new Schema({
    tipoPago: {
        type: String,
        required: true,
      
        
    },
    noTarjeta: {
        type: String,
        required: true,
      
        
    },
    expiracion: {
        type: Date,
        required: true,
       
    },
    cvv: {
        type: String,
        required: true,
       
    }
});

module.exports = mongoose.model('infoPagos', infoPagoSchema)
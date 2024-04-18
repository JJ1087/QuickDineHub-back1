const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = require('mongoose');

//especificaciones de tipo de datos
const infoPagoSchema = new Schema({
    idCliente: {
        type: ObjectId,
        required: true,
        
    },
    noTarjeta: {
        type: String,
        required: true,
      
        
    },
    nombreTitular: {
        type: String,
        required: true,
      
        
    },
    fechaVencimiento: {
        type: Date,
        required: true,
       
    },
    cvv: {
        type: String,
        required: true,
       
    }
});

module.exports = mongoose.model('bancoCuentas', infoPagoSchema)
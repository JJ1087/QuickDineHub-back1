const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//especificaciones de tipo de datos
const envioSchema = new Schema({
    nombre: {
        type: String,
        required: true,
      
        
    },
    direccion: {
        type: String,
        required: true,
      
        
    },
    ciudad: {
        type: String,
        required: true,
       
    },
    codigoPostal: {
        type: String,
        required: true,
       
    },
    estadoOrden: {
        type: String,
        default: '0',
       
    },
    descripcionProducto: {
        type: String,
        required: true,
    }
},{
    timestamps: true //guardar fecha y hora de solicitud del pedido

});

module.exports = mongoose.model('infOrdenes', envioSchema)
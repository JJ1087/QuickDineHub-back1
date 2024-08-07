const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = require('mongoose');

//especificaciones de tipo de datos
const autentificacionSchema = new Schema({
    userCorreo: { 
        type: String, 
        required: true, 
    },
    tipoEdicion: { 
        type: String, 
        required: true, 
    }
},{
    timestamps: true //guardar fecha de creacion y actualizacion de cuentas de usuario "NO REPUDIO"

}); 

module.exports = mongoose.model('autentificacionLogs', autentificacionSchema)
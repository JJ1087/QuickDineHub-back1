const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = require('mongoose');

//especificaciones de tipo de datos
const accesoLogSchema = new Schema({
    user_id: { 
        type: ObjectId, 
        required: true, 
    },
    inicioSesion: {
        type: Date,
    },
    cierreSesion: {
        type: Date,
    },
    intentosFallidos: {
        type: Number,
        required: true,
    },
    fechaBloqueo: {
        type: Date,
    },
    motivoBloqueo: {
        type: String,
        
    }
},{
    timestamps: true //guardar fecha de creacion y actualizacion de cuentas de usuario "NO REPUDIO"

});

module.exports = mongoose.model('accesoLogs', accesoLogSchema)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = require('mongoose');

//especificaciones de tipo de datos
const feedbackSchema = new Schema({
    idCliente: { 
        type: ObjectId, 
        required: true, 
    },
    respuestaUno: {
        type: Number,
        required: true,
    },
    respuestaDos: {
        type: Number,
        required: true,
    },
    respuestaTres: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model('feedback', feedbackSchema)
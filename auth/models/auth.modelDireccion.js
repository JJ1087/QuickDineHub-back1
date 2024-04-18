const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = require('mongoose');

//especificaciones de tipo de datos
const direccionSchema = new Schema({
    idCliente: { type: ObjectId, required: true, },
    cp: { type: String, required: true, default: 'noFront', },
    ciudad: { type: String, required: true, default: 'noFront', },
    colonia: { type: String, required: true, },
    calle: { type: String, required: true, },
    noCasa: { type: String, required: true, },
    datoExtra: { type: String, required: true, }
});

module.exports = mongoose.model('direcciones', direccionSchema)
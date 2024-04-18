const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = require('mongoose');
const { Decimal128 } = require('mongoose');

//especificaciones de tipo de datos
const detalleOrdenSchema = new Schema({
    idOrden: {type: ObjectId, required: true,},
    idProducto: {type: ObjectId,required: true,},
    
    nombreProducto: {type: String, required: true,},
    descripcionProducto: {type: String, required: true,},
    cantidadProducto: {type: Number, required: true,},
    
    costoUnidad:{type: Decimal128, required: true,},//cuanto cuesta el platillo en unidad
    subtotal:{type: Number,required: true,},

    especificacion:{type: String,},
    
});

module.exports = mongoose.model('detalleOrdenes', detalleOrdenSchema)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = require('mongoose');

//especificaciones de tipo de datos
const errorLogSchema = new Schema({
    timestamp: { type: Date, default: Date.now },
    errorDetails: { type: String, required: true },
    errorType: { type: String },
});

module.exports = mongoose.model('errorLogs', errorLogSchema)
const mongoose = require('mongoose');

let SchemaUsuario = mongoose.Schema({
    strNombre:{
        type: String,
        required:[true,'No se recibió el strNombre, favor de ingresarlo']
    },
    strApellido:{
        type:String,
        required:[true,'No se recibió el strApellido, favor de ingresarlo']
    },
    strEmail:{
        type:String,
        required:[true,'No se recibió el strEmail, favor de ingresarlo']
    }
})

module.exports = mongoose.model('usuario', SchemaUsuario);
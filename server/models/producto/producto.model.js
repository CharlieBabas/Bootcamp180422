const mongoose = require('mongoose');

let SchemaProducto = mongoose.Schema({

    blnEstado:{
        type: Boolean,
        default: true
    },
    strNombre:{
        type: String,
        required:[true,'No se recibió el strNombre, favor de ingresarlo']
    },
    strDescripcion:{
        type:String,
        required:[true,'No se recibió el strDescripcion, favor de ingresarla']
    },
    nmbPrecio:{
        type:Number,
        required:[true,'No se recibió el nmbPrecio, favor de ingresarlo']
    }
})

module.exports = mongoose.model('producto', SchemaProducto);
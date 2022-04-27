const mongoose = require('mongoose');

let SchemaEmpresa = mongoose.Schema({
    blnEstado:{
        type: Boolean,
        default: true
    },
    strNombre:{
        type: String,
        required: [true, 'No se recibió el strNombre, favor de ingresarlo']
    },
    strDescripcion:{
        type: String,
        required: [true, 'No se recibió el strDescripcion, favor de ingresarlo']
    },
    strTelefono:{
        type: String,
        required: [true, 'No se recibió el nmbTelefono, favor de ingresarlo']
    },
    strCodigoPostal:{
        type: String,
        required: [true, 'No se recibió el strCodigoPostal, favor de ingresarlo']
    },
    strCiudad:{
        type: String,
        required: [true, 'No se recibió el strCiudad, favor de ingresarlo']
    }
})
module.exports = mongoose.model('empresa', SchemaEmpresa);
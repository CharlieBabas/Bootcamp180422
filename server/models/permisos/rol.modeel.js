const mongoose = require('mongoose');

let SchemaRol = mongoose.Schema({
    strNombre:{
        type: String,
        required: 'No se recibió strNombre, favor de ingresarlo'
    },
    strDescripcion: {
        type: String,
        required: 'No se recibió strDescripcion, favor de ingresarlo'
    },
    arrObjIdApis:{
        type: Array,
        required: 'No se recibió arrObjIdApis, favor de ingresarlo'
    },
    blnRolDefault:{
        type:Boolean,
        default: false
    }
})

module.exports = mongoose.model('rol', SchemaRol)
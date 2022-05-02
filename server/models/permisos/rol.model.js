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
    // arrObjIdApis:{
    //     type: mongoose.Types.ObjectId,
    //     // required: 'No se recibió arrObjIdApis, favor de ingresarlo'
    // },
    arrObjIdApis:[mongoose.Types.ObjectId],
    blnRolDefault:{
        type:Boolean,
        default: false
    }
})

module.exports = mongoose.model('rol', SchemaRol)
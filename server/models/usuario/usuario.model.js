const mongoose = require('mongoose');

let SchemaUsuario = mongoose.Schema({
    blnEstado:{
        type: Boolean,
        default: true
    },
    strNombre:{
        type: String,
        required:[true,'No se recibió el strNombre, favor de ingresarlo']
    },
    strApellido:{
        type:String,
        required:[true,'No se recibió el strApellido, favor de ingresarlo']
    },

    strDireccion:{
        type:String
    },

    strNombreUsuario:{
        type:String,
        required:[true, 'No se recibió el strNombreUsuario, favor de ingresarlo']
    },

    strEmail:{
        type:String,
        required:[true,'No se recibió el strEmail, favor de ingresarlo']
    },

    strPassword:{
        type:String,
        required:[true,'No se recibó el strPassword, favor de ingresarlo']
    },
    idEmpresa:{
        type: mongoose.Types.ObjectId,
        required:[true,'No se reciibó el idEmpresa, favor de ingresarlo']
    }
})

module.exports = mongoose.model('usuario', SchemaUsuario);
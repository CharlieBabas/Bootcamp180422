const mongoose = require('mongoose');

let SchemaApi = mongoose.Schema({
    blnEstado:{
        type: Boolean,
        defautl: true
    },
    strRuta: {
        type: String,
        required: 'No se recibió strRuta, favor de ingresarlo'
    },
    strMetodo:{
        type: String,
        required: 'No se recibió strMetodo, favor de ingresarlo'
    },
    strDescripcion:{
        type:String,
        required:'No se recibió strDescripcion, favor de ingresarlo'
    },
    blnEsApi:{
        type:Boolean,
        default: true
    },
    blnEsMenu:{
        type:Boolean,
        default: false
    },
   
})

module.exports = mongoose.model('api', SchemaApi)
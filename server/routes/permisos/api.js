const express = require('express');
const app = express.Router();
const ApiModel = require('../../models/permisos/api.model')

app.post('/', async (req, res) => {
    try {
        // const body = req.body;
        const bodyApi = new ApiModel(req.body)
        const err = bodyApi.validateSync()
        if(err) {
            return res.status(400).json({
                ok:false,
                msg: 'Uno o mas campos no se registraron, favor de ingresarlos',
                cont: err
            })
        }
        if(!(bodyApi.strMetodo == 'GET' || bodyApi.strMetodo == 'POST' || bodyApi.strMetodo == 'PUT' || bodyApi.strMetodo == 'DELETE')){
            return res.status(400).json({
                ok:false,
                msg: 'El dato en strMetodo no es válido',
                cont: {
                    ingresado: bodyApi.strMetodo,
                    validos: 'GET, POST, PUT y DELETE'
                }
            })
        }

        const encontroApi = await ApiModel.findOne({strRuta:bodyApi.strRuta, strMetodo:bodyApi.strMetodo}, {strRuta:1, strMetodo:1, strDescripcion:1})
        if(encontroApi){
            return res.status(400).json({
                ok:false,
                msg: 'La api ya se encuentra registrada',
                cont: {encontroApi}
            })
        }

        const registroApi = await bodyApi.save()
        return res.status(200).json({
            ok:true,
            msg: 'Se registró la api de manera correcta',
            cont: {
                registroApi
            }
        })
        console.log(bodyApi);
    } catch (error) {
        return res.status(500).json({
            ok:false,
            msg:'Ocurrió un error en el servidor',
            cont: {
                error
            }
        })
    }
})



module.exports = app;
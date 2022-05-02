const express = require('express');
const app = express.Router();
const RolModel = require('../../models/permisos/rol.model')
const ApiModel = require('../../models/permisos/api.model');

app.post('/', async (req, res) => {
    try {
        const bodyRol = new RolModel(req.body)
        const err = bodyRol.validateSync()
        if(err){
            return res.status(400).json({
                ok:false,
                msg: 'Uno o mas campos no se registraron, favor de ingresarlos',
                cont: err
            })
        }

        if(!bodyRol.arrObjIdApis.length > 0){
            return res.status(400).json({
                ok:false,
                msg: 'Uno o mas campos no se registraron, favor de ingresarlos',
                cont: {
                    errors: {
                        arrObjIdApis: {
                            name: "ValidatorError",
                            message: "No se recibió arrObjIdApis, favor de ingresarlo",
                            propertie: {
                                message: "No se recibió arrObjIdApis, favor de ingresarlo",
                                type: "required",
                                path: "arrObjIdApis"
                            },
                            kind: "required",
                            path: "arrObjIdApis"
                        },
                    _message: "rol validation failed",
                    name: "ValidationError",
                    message: "rol validation failed: arrObjIdApis: No se recibió arrObjIdApis, favor de ingresarlo"
                    }
                }
            })
        }

        const encontroModel = await RolModel.findOne({strNombre:bodyRol.strNombre},{strNombre:1})

        if(encontroModel){
            return res.status(400).json({
                ok:false,
                msg: 'El rol ya se encuentra registrado',
                cont: encontroModel
            })
        }

        const registroRol = await bodyRol.save()

        return res.status(200).json({
            ok:true,
            msg: 'El rol se registró de manera exitosa',
            cont: { registroRol }
        })

        // console.log(bodyRol);
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

app.get('/', async (req,res) => {
    try {

        // const obtenerRol = await RolModel.find()
        const obtenerApiRol = await RolModel.aggregate([
            {
                // $lookup:{
                //     from: ApiModel.collection.name,
                //     localField: "arrObjIdApis",
                //     foreignField: "_id",
                //     as: "infoExtra"
                // }

                $lookup:{
                    from: ApiModel.collection.name,
                    let: { arrObjIdApis: '$arrObjIdApis' },
                    pipeline:[
                        {
                            $match: {
                                $expr:{
                                    $in: ['$_id','$$arrObjIdApis']
                                }  
                            }
                        },
                    {
                        $project: {
                            strRuta: 1,
                            strMetodo: 1,
                        }
                    }
                    ],
                    as: 'apis'
                }
            },
            // {
            //     $unwind: "$infoExtra"
            // }
        ])

        return res.status(200).json({
            ok:true,
            msg:'Roles encontrados',
            cont: obtenerApiRol
        })
    } catch (error) {
        
    }
})

module.exports = app;
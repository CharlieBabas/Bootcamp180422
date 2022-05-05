const express = require('express');
const UsuarioModel = require('../../models/usuario/usuario.model')
const EmpresaModel = require('../../models/empresa/empresa.model')
const RolModel = require('../../models/permisos/rol.model')
const app = express.Router();
const bcrypt = require('bcrypt');
const {verifAcceso} = require('../../middlewares/permisos')
const cargaArchivo = require('../../library/cargarArchivo');
const apiModel = require('../../models/permisos/api.model');

app.get('/mongoUsuarios', verifAcceso, async (req,res) => {
    const blnEstado = req.query.blnEstado == "false" ? false : true

    const obtenerUsuarioJoin = await UsuarioModel.aggregate([
        {
            $match: { blnEstado: blnEstado}
        },
        {
            $lookup:{
                from: EmpresaModel.collection.name,
                localField: "idEmpresa",
                foreignField: "_id",
                as: "empre_info"
            }
        },
        {
            $unwind: "$empre_info"
        },
        {
            $lookup:{
                from: RolModel.collection.name,
                let: { idObjRol: '$idObjRol' },
                pipeline:[
                    {
                        $match:{
                            $expr:{
                                $eq: ['$_id', '$$idObjRol']
                            }
                        },
                        
                    },
                    {
                        $lookup:{
                            from: apiModel.collection.name,
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
                            as:'apis',
                        }
                    },
                    {
                        $project:{
                            
                            strNombre:1,
                            strDescripcion:1,
                            blnRolDefault:1,
                            blnEstado:1,
                            apis:1
                        }
                    }
                ],
                // localField: "idObjRol",
                // foreignField: "_id",
                as: "rol_info"
            }
        },
        {
            $unwind: "$rol_info"
        },
        
    ])

    // const obtenerUsusario = await UsuarioModel.find({ blnEstado:blnEstado },{strPassword:0})
    if (!(obtenerUsuarioJoin.length > 0)){
        return res.status(400).json({
            ok: false,
            msg: 'No se encontró información',
        })
       
    }
    
    return res.status(200).json({
        ok: true,
        msg: 'Se recibieron los usuarios de manera exitosa',
        cont: {
            obtenerUsuarioJoin
        }
    })

    // return res.download(rutaDescarga, 'documento.html');
});


app.post('/',  async (req,res) =>{

    try {
        
    
        const body = { ...req.body , strPassword: req.body.strPassword ? bcrypt.hashSync(req.body.strPassword,10) : undefined };
        const usuarioBody = new UsuarioModel(body);
        const err = usuarioBody.validateSync();
    
        if(err){
            return res.status(400).json({
                ok:false,
                msg: 'No se recibió uno o más campos, favor de validar',
                cont: {
                    err
                }
            })
        }
    
        const obtenerEmails = await UsuarioModel.find({strEmail:body.strEmail})
    
        if(obtenerEmails.length > 0){
            // if(obtenerEmails.strEmail == body.strEmail){
                return res.status(400).json({
                    ok:false,
                    msg: 'Ya existe el correo',
                    cont: body.strEmail
                })
            // }
        }
    
        const obtenerUsName = await UsuarioModel.find({strNombreUsuario:body.strNombreUsuario})
    
        if(obtenerUsName.length > 0){
            return res.status(400).json({
                ok:false,
                msg: 'Ya existe el nombre de usuario ingresado',
                cont: body.strNombreUsuario
            })
        }
    
        const encontrarEmpresa = await EmpresaModel.findOne({_id: req.body.idEmpresa})
        if(!encontrarEmpresa){
            return res.status(400).json({
                ok:false,
                msg:'No existe ninguna empresa con el id',
                cont: req.body.idEmpresa
            })
        }

        if(body.idObjRol){
            const encontrarRol = await RolModel.findOne({_id: body.idObjRol})

            if(!encontrarRol){
                return res.status(400).json({
                    ok:false,
                    msg: 'No se encontro el Rol indicado'
                })
            }
        }else{
            const encontrarRol = await RolModel.findOne({blnRolDefault: true})

            usuarioBody.idObjRol = encontrarRol._id;
            // console.log(encontrarRol._id)
        }

        

        if(req.files){
            if(!req.files.strImagen){
                return res.status(400).json({
                    ok:false,
                    msg: 'No se recibió un archivo strImagen',
                })
            }

            usuarioBody.strImagen = await cargaArchivo.subirArchivo(req.files.strImagen, 'usuario', ['image/png', 'image/jpg'])
        }
        
        const usuarioRegistrado = await usuarioBody.save();
        return res.status(200).json({
            ok:true,
            msg: 'El usuario se ha sido registrado exitosamente',
            const: {
                usuarioRegistrado
            }
        })
    } catch (error) {
        const err = Error(error)

        return res.status(500).json({
            ok:false,
            msg:'Ocurrió un error en el servidor',
            cont: err.message ? err.message: err.name ? err.name : err
        })
    }
    
})

app.put('/', verifAcceso, async (req,res) => {
    try {
        const _idUsuario = req.body._idUsuario;

        if(!_idUsuario || _idUsuario.length != 24){
            return res.status(400).json({
                ok:false,
                msg: _idUsuario ? 'El identificador no es válido' : 'No se recibió el id del usuario',
                cont: _idUsuario
            })
        }

        const encontrarUsuario = await UsuarioModel.findOne({_id:_idUsuario, blnEstado:true});

        if(!encontrarUsuario){
            return res.status(400).json({
                ok:false,
                msg: 'No se encontró ningun usuario con el id',
                cont: _idUsuario
            })
        }

        const encontrarUsName = await UsuarioModel.findOne({strNombreUsuario: req.body.strNombreUsuario, _id: { $ne: _idUsuario }});
        if(encontrarUsName){
            // if(encontrarUsName.strNombreUsuario != encontrarUsuario.strNombreUsuario){
                return res.status(400).json({
                    ok:false,
                    msg: 'Ya existe ese nombre de usuario',
                    cont: req.body.strNombreUsuario
                })
            // }
            
        }

        const encontrarEmpresa = await EmpresaModel.findOne({_id: req.body.idEmpresa})
    if(!encontrarEmpresa){
        return res.status(400).json({
            ok:false,
            msg:'No existe ninguna empresa con el id',
            cont: req.body.idEmpresa
        })
    }

        const actualizarUsuario = await UsuarioModel.findByIdAndUpdate(_idUsuario, {$set:{strNombre: req.body.strNombre, strApellido: req.body.strApellido, strDireccion: req.body.strDireccion, strNombreUsuario: req.body.strNombreUsuario, idEmpresa: req.body.idEmpresa}},{new:true})

        return res.status(200).json({
            ok: true,
            msg: 'Se han modificado los datos del usuario de manera exitosa',
            cont:{
                usuarioAnterior: encontrarUsuario,
                usuarioActual: actualizarUsuario
            }
        })
        // console.log(actualizarUsuario);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Ocurrió un error en el servidor',
        })
    }
})

app.delete('/', verifAcceso, async (req,res) =>{
    try {
        const _idUsuario = req.query._idUsuario
        const blnEstado = req.query.blnEstado == "false" ? false : true
        
        if(!_idUsuario || _idUsuario.length != 24){
            return res.status(400).json({
                ok: false,
                msg: _idUsuario ? 'El identificador no es valido' : 'No se recibió el identificador del producto',
                cont: _idUsuario
            })
        }

        const modificarEstadoUsuario = await UsuarioModel.findOneAndUpdate({_id: _idUsuario},{$set:{blnEstado:blnEstado}}, {new:true})

        if(!modificarEstadoUsuario){
            return res.status(400).json({
                ok:false,
                msg: 'No se encontró ningún usuario con el id',
                cont: {
                    idUsuario: _idUsuario,
                }
            })
        }

        return res.status(200).json({
            ok:true,
            msg: blnEstado == true ? 'Se activó el usuario de manera exitosa' : 'Se desactivó el usuario de manera exitosa',
            cont: {
                idUsuario: _idUsuario,
                Estado: blnEstado
            }
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok:false,
            msg: 'ocurrió un error en el servidor',
            cont: error
        })
    }
})

module.exports = app;
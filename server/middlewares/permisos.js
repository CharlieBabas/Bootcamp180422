const jwt = require('jsonwebtoken')
const UsuarioModel = require('../models/usuario/usuario.model')
const RolModel = require('../models/permisos/rol.model')
const ApiModel = require('../models/permisos/api.model')
const ObjectId = require('mongoose').Types.ObjectId

const verifAcceso = async (req,res, next) => {
    try {
        // console.log('Estoy en el middelware');
        const urls = req.originalUrl.split('?')
        const originalUrl = urls[0] ? urls[0] : urls;
        const originalMethod = req.method;
        const token = req.get('token')
        if(!token){
            return res.status(400).json({
                ok:false,
                msg: 'No se recibió un token válido',
                cont: token
            })
        }

        const url = req.protocol + '://' + req.get('host') + req.originalUrl


        jwt.verify(token, process.env.SEED, async (err, decoded)=>{
            if(err){
                console.log(err.name, url.substring(0, url.indexOf('?')) )
                return res.status(400).json({
                    ok:false,
                    msg:err.name,
                })
            }

            if(!decoded.usuario._id){
                return res.status(400).json({
                    ok:false,
                    msg: 'No se recibió el _id de ususario',
                    cont: {
                        usuario: decoded.usuario
                    }
                })
            }

            const [obtenerUsuarioJoin] = await UsuarioModel.aggregate([
                { $match: { blnEstado: true}},
                {
                    $match: { _id: ObjectId(decoded.usuario._id) }
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
                            },
                        ],
                        as: "rol_info"
                    }
                },
                {
                    $unwind: "$rol_info"
                },
                
            ])

            if(!obtenerUsuarioJoin){
                return res.status(400).json({
                    ok:false,
                    msg: 'El usuario no existe'
                })
            }

            if(!obtenerUsuarioJoin.rol_info){
                return res.status(400).json({
                    ok:false,
                    msg: 'El usuario no tiene un rol asignado',
                    cont: {
                        usuario: decoded.usuario
                    }
                })
            }

            if(obtenerUsuarioJoin.rol_info.apis){
                if(!obtenerUsuarioJoin.rol_info.apis.length > 0){
                    return res.status(400).json({
                        ok:false,
                        msg: 'El usuario no tiene apis asignadas',
                        cont: {
                            apis: obtenerUsuarioJoin.rol_info.apis
                        }
                    })
                }
            }

            // console.log(obtenerUsuarioJoin.rol_info.apis.map(api => { return { strRuta: api.strRuta + Date.now }}))

            const encontroRuta = obtenerUsuarioJoin.rol_info.apis.find(api => '/api' + api.strRuta === originalUrl && api.strMetodo === originalMethod);
            if(!encontroRuta){
                return res.status(400).json({
                    ok:false,
                    msg: `El usuario no cuenta con acceso a la ruta ${originalUrl} en el método ${originalMethod}`
                })
            }
            console.log(encontroRuta, originalUrl);

            console.log('Se ha permitido el acceso a la ruta ', url.substring(0, url.indexOf('?')), 'al usuario: ', decoded.usuario.strNombreUsuario)
            // console.log(obtenerUsuarioJoin.rol_info);
            next();

            
            
        })
    
    } catch (error) {
        return res.status(400).json({
            ok:false,
            msg: 'Ocurrió un error del servidorcls',
            cont: error
        })
    }
}

module.exports = { verifAcceso }
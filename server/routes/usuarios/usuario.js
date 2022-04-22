const express = require('express');
const UsuarioModel = require('../../models/usuario/usuario.model')
const app = express.Router();
const bcrypt = require('bcrypt');

// let arrJsnUsuarios = [];

// let arrJsnUsuarios = [{_id:1, strNombre: 'Carlos', strApellido: 'Aguilar', strEmail:'caguilard@sigma-alimentos.com'}];
// const path = require('path');
// const rutaDescarga = path.resolve(__dirname, '../../assets/index.html');


// app.get('/obtenerUsuario', (req,res) => {
//     const idUsu = Number(req.query._id);
//     if(!idUsu){
//         return res.status(400).json({
//             ok: false,
//             msg: 'No ha ingresado ningún id'
//         })
//     }

//     const id = arrJsnUsuarios.find(id => id._id === idUsu)

//     if(!id){
//         return res.status(400).json({
//             ok: false,
//             msg: `No existe ningún usuario con el id ${idUsu} `
//         })
//     }

//     return res.status(200).json({
//         ok: true,
//         msg: 'Se encontró el siguiente usuario',
//         cont: {
//             id
//         }
//     })
// })


// app.get('/', (req,res) => {
//     const arrUsuarios = arrJsnUsuarios;
//     if (arrUsuarios.length > 0){
//         return res.status(200).json({
//             ok: true,
//             msg: 'Se recibieron los usuarios de manera exitosa',
//             cont: {
//                 arrUsuarios
//             }
//         })
//     }else{
//         return res.status(400).json({
//             ok: false,
//             msg: 'No se encontró información',
//         })
//     }

//     // return res.download(rutaDescarga, 'documento.html');
// });

// app.post('/', (req,res) => {

//     const body = {
//         _id: Number(req.body._id),
//         strNombre: req.body.strNombre,
//         strApellido: req.body.strApellido,
//         strEmail: req.body.strEmail
//     }

//     if( body._id && body.strNombre && body.strApellido && body.strEmail){

//         const id = arrJsnUsuarios.find( id => id._id === body._id );
//         const email = arrJsnUsuarios.find (mail => mail.strEmail === body.strEmail);

//         if(!id && !email){
//             arrJsnUsuarios.push(body);
//             return res.status(200).json({
//                 ok: true,
//                 msg: 'Se registró el usuario de manera exitosa',
//                 cont: {
//                     arrJsnUsuarios
//                 }
//             })
//         }else if(id){
//             return res.status(400).json({
//                 ok: false,
//                 msg: `El id ${req.body._id} ya existe`,
//             });
//         }else if(email){
//             return res.status(400).json({
//                 ok: false,
//                 msg: `El email ${req.body.strEmail} ya existe`,
//             });
//         }
//     }else{

//         return res.status(400).json({
//             ok: false,
//             msg: `No se han recibido todos los datos`,
//             cont: {
//                 body
//                 //strNombre: body.strNombre,
//                 //strApellido: body.strApellido,
//                 //strEmail: body.strEmail,
//                 //_id: body._id
//             }
//         });
//     }
    
// });

// app.put('/', (req,res) => {
//     const idUsu = Number(req.query.idUsu);
    
//     if(idUsu){
//         const foundId = arrJsnUsuarios.find( id => id._id === idUsu );
//         if (foundId) {
//             const actUsu = {
//                 _id: foundId._id, 
//                 strNombre: req.body.strNombre,
//                 strApellido: req.body.strApellido,
//                 strEmail: req.body.strEmail
//             }
//             const arrFilterUsu = arrJsnUsuarios.filter(idfi => idfi._id != idUsu);
//             arrJsnUsuarios = arrFilterUsu;
//             arrJsnUsuarios.push(actUsu);

//             return res.status(200).json({
//                 ok: true,
//                 msg: `El usuario con el id ${idUsu} se actualizó.`,
//                 cont: {
//                     actUsu
//                 }
//             });
            
//         }else{
//             return res.status(400).json({
//                 ok: false,
//                 msg: `El usuario con el id ${idUsu} no existe.`,
//                 cont: {
//                     idUsu
//                 }
//             });
//         }

//     }else{
//         return res.status(400).json({
//             ok: false,
//             msg: 'No ingresó el Identificador',
//             cont: {
//                 idUsu
//             }
//         });
//     }
// });

// app.delete('/', (req,res) => {
//     const idUsu = Number(req.query.idUsu);
    
//     if(idUsu){
//         const foundId = arrJsnUsuarios.find( id => id._id === idUsu );
//         if (foundId) {
//             const arrFilterUsu = arrJsnUsuarios.filter(idfi => idfi._id != idUsu);
//             arrJsnUsuarios = arrFilterUsu;

//             return res.status(200).json({
//                 ok: true,
//                 msg: `El usuario con el id ${idUsu} se borró.`,
//                 cont: {
//                     foundId
//                 }
//             });
            
//         }else{
//             return res.status(400).json({
//                 ok: false,
//                 msg: `El usuario con el id ${idUsu} no existe.`,
//                 cont: {
//                     idUsu
//                 }
//             });
//         }

//     }else{
//         return res.status(400).json({
//             ok: false,
//             msg: 'No ingresó el Identificador',
//             cont: {
//                 idUsu
//             }
//         });
//     }
// });



app.get('/mongoUsuarios', async (req,res) => {
    const obtenerUsusario = await UsuarioModel.find({},{strPassword:0})
    if (!(obtenerUsusario.length > 0)){
        return res.status(400).json({
            ok: false,
            msg: 'No se encontró información',
        })
       
    }
    
    return res.status(200).json({
        ok: true,
        msg: 'Se recibieron los usuarios de manera exitosa',
        cont: {
            obtenerUsusario
        }
    })

    // return res.download(rutaDescarga, 'documento.html');
});


app.post('/', async (req,res) =>{
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

    const obtenerUsuarios = await UsuarioModel.find({strEmail:body.strEmail})

    if(obtenerUsuarios.length > 0){
        return res.status(400).json({
            ok:false,
            msg: 'Ya existe el email ingresado',
            cont: body.strEmail
        })
    }

    const usuarioRegistrado = await usuarioBody.save();
    return res.status(200).json({
        ok:true,
        msg: 'El usuario se ha sido registrado exitosamente',
        const: {
            usuarioRegistrado
        }
    })
})

module.exports = app;
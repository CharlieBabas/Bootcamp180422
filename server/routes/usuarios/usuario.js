const express = require('express');
const app = express.Router();

// let arrJsnUsuarios = [];

let arrJsnUsuarios = [{_id:1, strNombre: 'Carlos', strApellido: 'Aguilar', strEmail:'caguilard@sigma-alimentos.com'}];
// const path = require('path');
// const rutaDescarga = path.resolve(__dirname, '../../assets/index.html');


app.get('/', (req,res) => {
    const arrUsuarios = arrJsnUsuarios;
    if (arrUsuarios.length > 0){
        return res.status(200).json({
            ok: true,
            msg: 'Se recibieron los usuarios de manera exitosa',
            cont: {
                arrUsuarios
            }
        })
    }else{
        return res.status(400).json({
            ok: false,
            msg: 'No se encontró información',
        })
    }

    // return res.download(rutaDescarga, 'documento.html');
});

app.post('/', (req,res) => {

    const body = {
        _id: Number(req.body._id),
        strNombre: req.body.strNombre,
        strApellido: req.body.strApellido,
        strEmail: req.body.strEmail
    }

    if( body._id && body.strNombre && body.strApellido && body.strEmail){

        const id = arrJsnUsuarios.find( id => id._id === body._id );
        const email = arrJsnUsuarios.find (mail => mail.strEmail === body.strEmail);

        if(!id && !email){
            arrJsnUsuarios.push(body);
            return res.status(200).json({
                ok: true,
                msg: 'Se registró el usuario de manera exitosa',
                cont: {
                    arrJsnUsuarios
                }
            })
        }else if(id){
            return res.status(400).json({
                ok: false,
                msg: `El id ${req.body._id} ya existe`,
            });
        }else if(email){
            return res.status(400).json({
                ok: false,
                msg: `El email ${req.body.strEmail} ya existe`,
            });
        }
    }else{

        return res.status(400).json({
            ok: false,
            msg: `No se han recibido todos los datos`,
            cont: {
                body
                //strNombre: body.strNombre,
                //strApellido: body.strApellido,
                //strEmail: body.strEmail,
                //_id: body._id
            }
        });
    }
    
});

app.put('/', (req,res) => {
    const idUsu = Number(req.query.idUsu);
    
    if(idUsu){
        const foundId = arrJsnUsuarios.find( id => id._id === idUsu );
        if (foundId) {
            const actUsu = {
                _id: foundId._id, 
                strNombre: req.body.strNombre,
                strApellido: req.body.strApellido,
                strEmail: req.body.strEmail
            }
            const arrFilterUsu = arrJsnUsuarios.filter(idfi => idfi._id != idUsu);
            arrJsnUsuarios = arrFilterUsu;
            arrJsnUsuarios.push(actUsu);

            return res.status(200).json({
                ok: true,
                msg: `El usuario con el id ${idUsu} se actualizó.`,
                cont: {
                    actUsu
                }
            });
            
        }else{
            return res.status(400).json({
                ok: false,
                msg: `El usuario con el id ${idUsu} no existe.`,
                cont: {
                    idUsu
                }
            });
        }

    }else{
        return res.status(400).json({
            ok: false,
            msg: 'No ingresó el Identificador',
            cont: {
                idUsu
            }
        });
    }
});

app.delete('/', (req,res) => {
    const idUsu = Number(req.query.idUsu);
    
    if(idUsu){
        const foundId = arrJsnUsuarios.find( id => id._id === idUsu );
        if (foundId) {
            const arrFilterUsu = arrJsnUsuarios.filter(idfi => idfi._id != idUsu);
            arrJsnUsuarios = arrFilterUsu;

            return res.status(200).json({
                ok: true,
                msg: `El usuario con el id ${idUsu} se borró.`,
                cont: {
                    foundId
                }
            });
            
        }else{
            return res.status(400).json({
                ok: false,
                msg: `El usuario con el id ${idUsu} no existe.`,
                cont: {
                    idUsu
                }
            });
        }

    }else{
        return res.status(400).json({
            ok: false,
            msg: 'No ingresó el Identificador',
            cont: {
                idUsu
            }
        });
    }
});

module.exports = app;
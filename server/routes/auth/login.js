const express = require('express');
const app = express.Router();
const UsuarioModel = require('../../models/usuario/usuario.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('../../config/config')

app.post('/login', async (req,res) =>{

    try {
        const strEmail = req.body.strEmail
        const strPassw = req.body.strPassword

        

        if(!strEmail || !strPassw){
            return res.status(400).json({
                ok:false,
                msg: !strEmail && !strPassw ? 'No se recibieron las credenciales' : strEmail ? 'Ingrese la contraseña' : 'Ingrese el password'
            })
        }

        const findByEmail = await UsuarioModel.findOne({strEmail: strEmail})

        if(!findByEmail){
            return res.status(400).json({
                ok:false,
                msg:'Credenciales incorrectas'
            })
        }

        const password = bcrypt.compareSync(strPassw, findByEmail.strPassword);

        if(password == false){
            return res.status(400).json({
                ok:false,
                msg:'Credenciales incorrectas'
            })
        }

        const token = jwt.sign({usuario: findByEmail},process.env.SEED,{expiresIn:process.env.CADUCIDAD_TOKEN})

        return res.status(200).json({
            ok:true,
            msg:'Bienvenido',
            cont: token
        })

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
const jwt = require('jsonwebtoken')

const verifAcceso = async (req,res, next) => {
    try {
        // console.log('Estoy en el middelware');

        const token = req.get('token')
        if(!token){
            return res.status(400).json({
                ok:false,
                msg: 'No se recibió un token válido',
                cont: token
            })
        }

        const url = req.protocol + '://' + req.get('host') + req.originalUrl


        jwt.verify(token, process.env.SEED, (err, decoded)=>{
            if(err){
                console.log(err.name, url.substring(0, url.indexOf('?')) )
                return res.status(400).json({
                    ok:false,
                    msg:err.name,
                })
            }
            console.log('Se ha permitido el acceso a la ruta ', url.substring(0, url.indexOf('?')), 'al usuario: ', decoded )
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
const express = require('express');
const app = express.Router();
const path = require('path');
const fs = require('fs');
// require('')

app.get('/:ruta/:nameImg', async (req,res) => {

    try {
        const ruta = req.params.ruta;
        const nameImg = req.params.nameImg;

        const rutaImagen = path.resolve(__dirname, `../../../upload/${ruta}/${nameImg}`)
        const noImage = path.resolve(__dirname, `../../assets/no-image.jpg`)

        if(!fs.existsSync(rutaImagen)){
            return res.sendFile(noImage)
        }
        return res.sendFile(rutaImagen)
    } catch (error) {
        return res.status(500).json({
            ok:false,
            msg: 'Error',
            cont: {
                rutaImagen
            }
        })
    }
    


})

module.exports = app;
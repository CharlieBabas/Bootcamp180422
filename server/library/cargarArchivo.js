const express = require('express')
const app = express()
const fileUpload = require('express-fileupload');
const uniqid = require('uniqid');
const fs = require('fs');
const path = require('path')

app.use(fileUpload());

const subirArchivo = async (file, route, exts) =>{


    if(!file){
        throw new Error('No se recibió un archivo válido')
    }
    if(!exts.includes(file.mimetype)){
        throw new Error(`Solo las extensiones (${exts.join(',')}) son aceptadas`)
    }
    let nameImg = uniqid() + path.extname(file.name)

    await file.mv(path.resolve(__dirname, `../../upload/${route}/${nameImg}`)).catch(error => {
        // console.log(error);
        throw new Error ('Error al tratar de subir el archivo al servidor')
    })
    return nameImg

    
    // console.log(nameImg);
}

module.exports = { subirArchivo }
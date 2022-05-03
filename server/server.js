require('./config/config');
require('colors');
const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const app = express()
app.use(fileUpload())
app.use(express.urlencoded({ extended:true }))
app.use('/api', require('./routes/index'))
// console.log(process.env.URLDB, 'URLDB');
mongoose.connect(process.env.URLDB, (err, resp) => {
    if(err){
        console.log('Error al conectar la base de datos');
        return err
    }
    console.log("Base de datos ONLINE", (process.env.URLDB).blue);
});

app.listen(process.env.PORT,() => {
    console.log('[NODE]'.green, 'está corriendo en el puerto: ', (process.env.PORT).yellow);
});
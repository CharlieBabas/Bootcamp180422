const express = require('express');
const app = express.Router();

// let arrJsnProd = [];
let arrJsnProd = [{_id:1, strNombre:"", strDescripcion:"", nmbCantidad:0, nmbPrecio:0}];

app.get('/', (req,res) =>{
    const arrProd = arrJsnProd;
    if(!arrProd.length > 0){
        return res.status(400).json({
            ok: false,
            msg: 'No hay información'
        });
        
    }
    return res.status(200).json({
        ok: true,
        msg: 'Se encontró la sig. información',
        cont: {
            arrProd
        }
    })
});

app.post('/', (req,res) => {
    const body = {
        _id: Number(req.body._id),
        strNombre: req.body.strNombre,
        strDescripcion: req.body.strDescripcion,
        nmbCantidad: Number(req.body.nmbCantidad),
        nmbPrecio: Number(req.body.nmbPrecio),
    }

    if(!(body._id && body.strNombre && body.strDescripcion && body.nmbCantidad && body.nmbPrecio)){
        return res.status(400).json({
            ok: false,
            msg: 'Algún dato no fue ingresado',
            cont: {
                body
            }
        });
    }

    const id = arrJsnProd.find(id => id._id === body._id );

    if(id){
        return res.status(400).json({
            ok: false,
            msg: `Ya existe el id ${body._id}`,
            cont: {
                id
            }
        });
    }

    arrJsnProd.push(body);

    return res.status(200).json({
        ok: true,
        msg: 'Se ha grabado exitosamente el producto',
        cont: {
            body
        }
    });
});

app.put('/', (req,res) => {
    const idProd = Number(req.query._id);

    if(!idProd){
        return res.status(400).json({
            ok: false,
            msg: 'No ha ingresado un id de producto'
        })
    }

    const id = arrJsnProd.find(id => id._id === idProd);

    if(!id){
        return res.status(400).json({
            ok: false,
            msg: `No existe ningún producto con el id ${idProd}`,
        })
    }

    const actPrd = {
        _id: id._id, 
        strNombre: req.body.strNombre,
        strDescripcion: req.body.strDescripcion,
        nmbCantidad: req.body.nmbCantidad,
        nmbPrecio: req.body.nmbPrecio
    }

    const arrProdFilt = arrJsnProd.filter(id => id._id != idProd);
    arrJsnProd = arrProdFilt;

    arrJsnProd.push(actPrd)

    return res.status(200).json({
        ok: true,
        msg: `Se ha modificado con éxito el producto ${idProd}`,
        cont: {
            actPrd
        }
    })
});

app.delete('/', (req,res) => {
    const idProd = Number(req.query._id);

    if(!idProd){
        return res.status(400).json({
            ok: false,
            msg: 'No ha ingresado un id de producto'
        })
    }

    const id = arrJsnProd.find(id => id._id === idProd);

    if(!id){
        return res.status(400).json({
            ok: false,
            msg: `No existe ningún producto con el id ${idProd}`,
        })
    }

    const arrProdFilt = arrJsnProd.filter(id => id._id != idProd);
    arrJsnProd = arrProdFilt;

    return res.status(200).json({
        ok: true,
        msg: `Se ha borrado con éxito el producto ${idProd}`,
        cont: {
            id
        }
    })

})

module.exports = app;
const express = require('express');
const ProductoModel = require('../../models/producto/producto.model');
const app = express.Router();

// let arrJsnProd = [];
// let arrJsnProd = [{_id:1, strNombre:"", strDescripcion:"", nmbCantidad:0, nmbPrecio:0}];

// app.get('/', (req,res) =>{
//     const arrProd = arrJsnProd;
//     if(!arrProd.length > 0){
//         return res.status(400).json({
//             ok: false,
//             msg: 'No hay información'
//         });
        
//     }
//     return res.status(200).json({
//         ok: true,
//         msg: 'Se encontró la sig. información',
//         cont: {
//             arrProd
//         }
//     })
// });

// app.post('/', (req,res) => {
//     const body = {
//         _id: Number(req.body._id),
//         strNombre: req.body.strNombre,
//         strDescripcion: req.body.strDescripcion,
//         nmbCantidad: Number(req.body.nmbCantidad),
//         nmbPrecio: Number(req.body.nmbPrecio),
//     }

//     if(!(body._id && body.strNombre && body.strDescripcion && body.nmbCantidad && body.nmbPrecio)){
//         return res.status(400).json({
//             ok: false,
//             msg: 'Algún dato no fue ingresado',
//             cont: {
//                 body
//             }
//         });
//     }

//     const id = arrJsnProd.find(id => id._id === body._id );

//     if(id){
//         return res.status(400).json({
//             ok: false,
//             msg: `Ya existe el id ${body._id}`,
//             cont: {
//                 id
//             }
//         });
//     }

//     arrJsnProd.push(body);

//     return res.status(200).json({
//         ok: true,
//         msg: 'Se ha grabado exitosamente el producto',
//         cont: {
//             body
//         }
//     });
// });

// app.put('/', (req,res) => {
//     const idProd = Number(req.query._id);

//     if(!idProd){
//         return res.status(400).json({
//             ok: false,
//             msg: 'No ha ingresado un id de producto'
//         })
//     }

//     const id = arrJsnProd.find(id => id._id === idProd);

//     if(!id){
//         return res.status(400).json({
//             ok: false,
//             msg: `No existe ningún producto con el id ${idProd}`,
//         })
//     }

//     const actPrd = {
//         _id: id._id, 
//         strNombre: req.body.strNombre,
//         strDescripcion: req.body.strDescripcion,
//         nmbCantidad: req.body.nmbCantidad,
//         nmbPrecio: req.body.nmbPrecio
//     }

//     const arrProdFilt = arrJsnProd.filter(id => id._id != idProd);
//     arrJsnProd = arrProdFilt;

//     arrJsnProd.push(actPrd)

//     return res.status(200).json({
//         ok: true,
//         msg: `Se ha modificado con éxito el producto ${idProd}`,
//         cont: {
//             actPrd
//         }
//     })
// });

// app.delete('/', (req,res) => {
//     const idProd = Number(req.query._id);

//     if(!idProd){
//         return res.status(400).json({
//             ok: false,
//             msg: 'No ha ingresado un id de producto'
//         })
//     }

//     const id = arrJsnProd.find(id => id._id === idProd);

//     if(!id){
//         return res.status(400).json({
//             ok: false,
//             msg: `No existe ningún producto con el id ${idProd}`,
//         })
//     }

//     const arrProdFilt = arrJsnProd.filter(id => id._id != idProd);
//     arrJsnProd = arrProdFilt;

//     return res.status(200).json({
//         ok: true,
//         msg: `Se ha borrado con éxito el producto ${idProd}`,
//         cont: {
//             id
//         }
//     })

// })


app.get('/db', async (req, res) => {
    const blnEstado = req.query.blnEstado == "false" ? false : true

    const obtenerProductos = await ProductoModel.find({blnEstado:blnEstado})

    // función con aggregate

    const obtenerProudctoConAggregate = await ProductoModel.aggregate([
        { $match: { $expr: { $eq: ["$blnEstado", blnEstado] } } },
        { $project: { strNombre:1, nmbPrecio:1 } }
    ]);

    console.log(obtenerProudctoConAggregate);

    // función con aggregate


    return res.status(200).json({
        ok:true,
        msg: 'Accedi a la ruta producto',
        cont: {
            obtenerProductos
        }
    })
})

app.post('/', async (req, res) => {
    const body = req.body;
    const productoBody = new ProductoModel(body)
    const err = productoBody.validateSync();
    // console.log(productoBody);
    if(err){
        return res.status(400).json({
            ok:false,
            msg: 'No se recibió uno o más campos, favor de validar',
            cont: {
                err
            }
        })
    }

    const encontrarProducto = await ProductoModel.findOne({strNombre:body.strNombre}, {strNombre:1})

    if(encontrarProducto){
        return res.status(400).json({
            ok:false,
            msg: 'Ya existe un proudcto con el nombre',
            cont: body.strNombre
        })
    }

    const productoRegistrado = await productoBody.save();
    return res.status(200).json({
        ok:true,
        msg: 'El producto ha sido registrado exitosamente',
        const: {
            productoRegistrado
        }
    })
})

app.put('/', async (req,res) => {
    try {
        const _idProducto = req.query._idProducto;
        // console.log(_idProducto.length);

        if(!_idProducto ||_idProducto.length != 24){
            return res.status(400).json({
                ok: false,
                msg: _idProducto ? 'El identificador no es valido' : 'No se recibió el identificador del producto',
                cont: _idProducto
            })
        }
        const encontrarProducto = await ProductoModel.findOne({_id: _idProducto, blnEstado:true});

        if(!encontrarProducto){
            return res.status(400).json({
                ok: false,
                msg: 'No se encontró ningun producto con el id',
                cont: _idProducto
            })
        }

        // const actualizarProducto = await ProductoModel.updateOne({_id: _idProducto},{$set:{...req.body}});
        const actualizarProducto = await ProductoModel.findByIdAndUpdate( _idProducto, {$set: {...req.body}}, {new:true});
        if(!actualizarProducto){
            return res.status(200).json({
                ok: false,
                msg: 'No se pudo actualizar el producto, intente de nuevo',
                cont: {
                    
                }
            })

        }

        return res.status(200).json({
            ok: true,
            msg: 'Se ha modificado el producto de manera correcta',
            cont: {
                productoAnterior: encontrarProducto,
                productoActualiz: actualizarProducto
            }
        })

        // console.log(encontrarProducto);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: 'Ocurrió un error en el servidor',
        })
        
    }
    
})

app.delete('/', async (req,res) =>{
    
    try {

        const _idProducto = req.query._idProducto
    
        if(!_idProducto || _idProducto.length != 24){
            return res.status(400).json({
                ok: false,
                msg: _idProducto ? 'El identificador no es valido' : 'No se recibió el identificador del producto',
                cont: _idProducto
            })
        }

        const encontrarProducto = await ProductoModel.findOne({_id: _idProducto, blnEstado:true})

        if(!encontrarProducto){
            return res.status(400).json({
                ok:false,
                msg: 'No existe ningún producto con el id',
                cont: _idProducto
            })
        }

        // const borrarProducto = await ProductoModel.findByIdAndDelete(_idProducto)
        const borrarProducto = await ProductoModel.findOneAndUpdate({_id:_idProducto}, {$set: {blnEstado:false}}, {new:true})
        if(!borrarProducto){
            return res.status(400).json({
                    ok:false,
                    msg: 'ocurrió un error al eliminar el producto',
                    cont: _idProducto
            })
        }

        return res.status(200).json({
            ok:true,
            msg: 'Se ha eliminado el producto correctamente',
            cont: borrarProducto
        })
        
    } catch (error) {
        return res.status(400).json({
            ok:false,
            msg: 'ocurrió un error en el servidor',
            cont: error
        })
    }


})
module.exports = app;
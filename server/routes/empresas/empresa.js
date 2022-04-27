const express = require('express');
const EmpresaModel = require('../../models/empresa/empresa.model');
const app = express.Router()

app.get('/', async (req,res) => {
    try {
        const blnEstado = req.query.blnEstado == "false" ? false : true
        
        const obtenerProductos = await EmpresaModel.aggregate([
            {$match: {blnEstado: blnEstado}},
        ])
        console.log(obtenerProductos);

        if(!(obtenerProductos.length > 0)){
            return res.status(400).json({
                ok:false,
                msg:'No se encontró información'
            })
        }

        return res.status(200).json({
            ok:true,
            msg: 'Se encontró la siguiente información',
            cont: obtenerProductos
        })    

    } catch (error) {

        return res.status(400).json({
            ok:false,
            msg: 'Ocurrió un error en el servidor',
            cont: { 
                error
        }
    })
        
    }
})

app.post('/', async (req, res) => {
    const body = req.body;
    const empresaBody = new EmpresaModel(body)
    const err = empresaBody.validateSync();
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

    const encontrarEmpresa = await EmpresaModel.findOne({strNombre:body.strNombre}, {strNombre:1})

    if(encontrarEmpresa){
        return res.status(400).json({
            ok:false,
            msg: 'Ya existe una empresa con el nombre',
            cont: body.strNombre
        })
    }

    const empresaRegistrada = await empresaBody.save();
    return res.status(200).json({
        ok:true,
        msg: 'La empresa ha sido registrado exitosamente',
        const: {
            empresaRegistrada
        }
    })
})

app.put('/', async (req,res) => {
    try {
        const _idEmpresa = req.query._idEmpresa;
        // console.log(_idEmpresa.length);

        if(!_idEmpresa ||_idEmpresa.length != 24){
            return res.status(400).json({
                ok: false,
                msg: _idEmpresa ? 'El identificador no es valido' : 'No se recibió el identificador del producto',
                cont: _idEmpresa
            })
        }
        const encontrarEmpresa = await EmpresaModel.findOne({_id: _idEmpresa, blnEstado:true});

        if(!encontrarEmpresa){
            return res.status(400).json({
                ok: false,
                msg: 'No se encontró ningun producto con el id',
                cont: _idEmpresa
            })
        }

        // const actualizarEmpresa = await EmpresaModel.updateOne({_id: _idEmpresa},{$set:{...req.body}});
        const actualizarEmpresa = await EmpresaModel.findByIdAndUpdate( _idEmpresa, {$set: {...req.body}}, {new:true});
        if(!actualizarEmpresa){
            return res.status(200).json({
                ok: false,
                msg: 'No se pudo actualizar la empresa, intente de nuevo',
                cont: {
                    
                }
            })

        }

        return res.status(200).json({
            ok: true,
            msg: 'Se ha modificado la empresa de manera correcta',
            cont: {
                empresaAnterior: encontrarEmpresa,
                empresaACtualiz: actualizarEmpresa
            }
        })

        // console.log(encontrarEmpresa);
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

        const _idEmpresa = req.query._idEmpresa
    
        if(!_idEmpresa || _idEmpresa.length != 24){
            return res.status(400).json({
                ok: false,
                msg: _idEmpresa ? 'El identificador no es valido' : 'No se recibió el identificador del producto',
                cont: _idEmpresa
            })
        }

        const encontrarEmpresa = await EmpresaModel.findOne({_id: _idEmpresa, blnEstado:true})

        if(!encontrarEmpresa){
            return res.status(400).json({
                ok:false,
                msg: 'No existe ninguna empresa con el id',
                cont: _idEmpresa
            })
        }

        // const borrarEmpresa = await EmpresaModel.findByIdAndDelete(_idEmpresa)
        const borrarEmpresa = await EmpresaModel.findOneAndUpdate({_id:_idEmpresa}, {$set: {blnEstado:false}}, {new:true})
        if(!borrarEmpresa){
            return res.status(400).json({
                    ok:false,
                    msg: 'ocurrió un error al eliminar la empresa',
                    cont: _idEmpresa
            })
        }

        return res.status(200).json({
            ok:true,
            msg: 'Se ha eliminado la empresa correctamente',
            cont: borrarEmpresa
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
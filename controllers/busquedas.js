//getTodo

const {response} = require('express');
const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');


const getTodo = async (req, res=response)=>{
    
    const busqueda = req.params.busqueda;
    const regex = RegExp(busqueda, 'i');
    
    
    
    // const usuarios = await Usuario.find({nombre:regex});
    // const medicos = await Medico.find({nombre:regex});
    // const hospitales = await Hospital.find({nombre:regex});

    //ejecutar await de forma simultanea

    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({nombre:regex}),
        Medico.find({nombre:regex}),
        Hospital.find({nombre:regex})
    ]);
    

    try {
        res.json({
            ok: true,
            usuarios,
            medicos,
            hospitales,
            busqueda:busqueda
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Contactese con el admin'
        })
    }
};

const getDocumentosColeccion = async (req, res=response)=>{
    
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = RegExp(busqueda, 'i');
    let data = [];

    switch (tabla) {
        case 'usuarios':
            data = await Usuario.find({nombre:regex});
            break;
        case 'hospitales':
            data = await Hospital.find({nombre:regex})
                                 .populate('usuario','nombre img');            
            break;
        case 'medicos':
            data = await Medico.find({nombre:regex})
                               .populate('usuario','nombre img')
                               .populate('hospital','nombre img');
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: "La ruta debe especificar la tabla usuarios, medicos u hospitales"
            });

           
    }

    res.json({
        ok: true,
        coleccion:tabla,
        resultados: data
    })
    
};




module.exports = {
    getTodo,
    getDocumentosColeccion
}
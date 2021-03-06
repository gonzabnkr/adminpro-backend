const {response} = require('express')
const Hospital = require('../models/hospital');

const getHospitales = async (req, res=response)=>{
    const hospitales = await Hospital.find()
                                     .populate('usuario','nombre img')
    res.json({
        ok: true,
        hospitales
    })
};

const crearHospital = async (req, res=response)=>{
    
    const uid = req.id
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });
    console.log(uid)
    
    try {
        
        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }

    
};

const actualizarHospital = (req, res=response)=>{
    res.json({
        ok: true,
        msg: 'ActualizarHospital'
    })
};

const borrarHospital = (req, res=response)=>{
    res.json({
        ok: true,
        msg: 'borrarHospital'
    })
};


module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital,
}
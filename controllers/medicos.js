const {response} = require('express')

const Medico = require('../models/medico')

const getMedicos = async (req, res=response)=>{
    
    const medicos = await Medico.find()
                                .populate('usuario','nombre img')
                                .populate('hospital', 'nombre img')
    
    res.json({
        ok: true,
        medicos
    })
};

const crearMedico = async (req, res=response)=>{
    const uid = req.id
    const medico = new Medico({usuario: uid,...req.body})

    try {

        const medicoDb =  await medico.save();
        res.json({
            ok:true,
            medico: medicoDb
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el admin'
        })
    }
    
};

const actualizarMedico = (req, res=response)=>{
    res.json({
        ok: true,
        msg: 'ActualizarMedico'
    })
};

const borrarMedico = (req, res=response)=>{
    res.json({
        ok: true,
        msg: 'borrarMedico'
    })
};


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
}
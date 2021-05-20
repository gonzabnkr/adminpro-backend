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

const actualizarHospital = async (req, res=response)=>{
    
    const id = req.params.id;
    const uid = req.params.uid;

    try {
        
        const hospitalDB = await Hospital.findById(id);

        if(!hospitalDB){
            return res.status(404).json({
                ok:false,
                msg: 'No existe el Hospital'
            });
        };

        const cambioHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate(id,cambioHospital,{new:true})


        res.json({
            ok: true,
            msg: 'ActualizarHospital',
            hospitalActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })    
    }
    
    
};

const borrarHospital = async (req, res=response)=>{
    
    const id = req.params.id
    
    try {
        
        const hospitalDB = await Hospital.findById(id);

        if(!hospitalDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el Hospital'
            })
        };

        await Hospital.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Hospital eleminado'
        })

               
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar'
        })
        
        
    }

};


module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital,
}
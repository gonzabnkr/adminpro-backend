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

const actualizarMedico = async (req, res=response)=>{
    
    const id = req.params.id;
    const uid = req.params.uid;
    

    try {

        const medicoDb = await Medico.findById(id);
        
        if (!medicoDb){
            return res.status(404).json({
                ok:false,
                msg: 'No existe el Medico'
            });
        }

        const cambioMedico ={
            ...req.body,
            usuario: uid,
        }
        const medicoActualizado = await Medico.findByIdAndUpdate(id,cambioMedico,{new:true})
        res.json({
            ok: true,
            medicoActualizado
        })
        
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        }) 
        
    }
};

const borrarMedico = async (req, res=response)=>{
    const id = req.params.id;

    try {

        const medicoDb = await Medico.findById(id);
        
        if (!medicoDb){
            return res.status(404).json({
                ok:false,
                msg: 'No existe el Medico'
            });
        }
        await Medico.findByIdAndDelete(id)
        res.json({
            ok: true,
            msg: 'Medico Borrado'
        })
        
    } catch (error) {

        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        }) 
        
    }
};


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
}
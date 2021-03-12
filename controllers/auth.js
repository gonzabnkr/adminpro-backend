const {response} = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require ('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const login = async (req,res=response)=>{
    const {email,password}= req.body;
    try {

        const usuarioDB = await Usuario.findOne({email});
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Error de logueo (email)'
            })
        }
        //verificar contraseña, ya que el email es validdo
        const validPassword = bcrypt.compareSync(password,usuarioDB.password);
        if (!validPassword){
            return res.status(404).json({
                ok: false,
                msg: 'Error de logueo (pass)'
            })
        }

        //generate token - JWT

        const token = await generateJWT(usuarioDB.id);

        res.json({
            ok: true,
            token
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok:false,
            msg: 'Error de login'
        })
    }
}

module.exports={
    login
}
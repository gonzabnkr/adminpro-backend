const {response} = require('express');
const bcrypt = require ('bcryptjs');
const Usuario = require('../models/usuario');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req,res = response)=>{
    const googleToken = req.body.token;

    try {
        const {name,email,picture} = await googleVerify(googleToken)
        const usuarioDB = await Usuario.findOne({email});
        let usuario;

        if(!usuarioDB){
            usuario = new Usuario({
               nombre : name,
               email,
               password: '@@@',
               img : picture,
               google: true,
            })
        }else{
            usuario = usuarioDB;
            usuario.google = true,
            usuario.password = '@@@'
        }
        
        await usuario.save();
        const token = await generateJWT(usuario.id);
        
        res.json({
            ok: true,
            token
        });
  
        
    } catch (err) {
        res.status(401).json({
            ok:false,
            msg: 'Token invalido'
        })
    }

   
}

const renewToken = async(req, res = response) => {

    const uid = req.uid;
	

    // Generar el TOKEN - JWT
    const token = await generateJWT( uid );

    // Obtener el usuario por UID
	 const usuario = await Usuario.findById( uid );


    res.json({
        ok: true,
        token,
        usuario
    });

}

module.exports={
    login,
    googleSignIn,
    renewToken
}
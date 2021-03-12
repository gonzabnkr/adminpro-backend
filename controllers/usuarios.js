const {response} = require('express');
const bcrypt = require ('bcryptjs')
const Usuario = require('../models/usuario');
const { generateJWT } = require('../helpers/jwt');



const crearUsuario = async (req,res=response)=>{
    const {email,password,nombre} = req.body

    //generate token - JWT

    

    try {
        const existeEmail = await Usuario.findOne({email});
        if(existeEmail){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado'
            })
        }
        const usuario = new Usuario(req.body);
        
        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password,salt) 
        
        // guardar usuario
        await usuario.save();
        
        //Generar token
        const token = await generateJWT(usuario.id);

        res.json({
            ok:true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado, revisar logs'
        })
    }
    
}

const getUsuarios = async (req,res=response)=>{

    const usuarios = await Usuario.find({}, 'nombre role id email');
    res.json({
        ok:true,
        usuarios,
        id : 'Usuario que genero la consulta: '+req.id
    })
}

const actualizarUsuario = async (req,res=response)=>{
    //TODO: Validar token y comprobar si es el usuario correcto

    const id = req.params.id;
    
    try {

        const usuarioDB = await Usuario.findById(id);

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario'
            })
        };
        
        //Actualizaciones
        const {password,google,email,...campos} = req.body;

        if(usuarioDB.email !== email){
            
            const existeEmail = await Usuario.findOne({email});
               if(existeEmail){
                    return res.status(400).json({
                        ok: false,
                        msg: 'Ya existe un usuario con ese email'
                })
            }
        }
        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate( id, campos, {new:true})

        res.json({
            ok: true,
            usuarioActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error id'
        })
    }
}

const deleteUsuario = async (req,res=response) =>{

    const id = req.params.id;
        
    try {

        const usuarioDB = await Usuario.findById(id);

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario'
            })
        };
        await Usuario.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'usuario eleminado'
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar'
        })
        
    }

}

module.exports = {
    crearUsuario,
    getUsuarios,
    actualizarUsuario,
    deleteUsuario
}
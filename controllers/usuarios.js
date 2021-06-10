const {response} = require('express');
const bcrypt = require ('bcryptjs')
const Usuario = require('../models/usuario');
const { generateJWT } = require('../helpers/jwt');



const crearUsuario = async (req,res=response)=>{
    const {email,password} = req.body

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

    const desde = Number(req.query.desde) || 0;
    
    
    // const usuarios = await Usuario.find({}, 'nombre role id email')
    //                               .skip(desde)
    //                               .limit(5);
                            
    // const total = await Usuario.count();
    
    //mismo codigo, pero para ejecutra simultaneamente ambos await
    const [usuarios, total] = await Promise.all([
        Usuario
            .find({}, 'nombre role id img email')
            .skip(desde)
            .limit(5),
        Usuario.countDocuments()

    ]);

    
    
    
    res.json({
        ok:true,
        uid: req.uid,
        usuarios,
        total
    })
}

const actualizarUsuario = async (req,res=response)=>{
    //TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;
    
    try {

        const usuarioDB = await Usuario.findById(uid);

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
        if (!usuarioDB.google){
            campos.email = email;
        } else if (usuarioDB.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuarios de Google no pueden cambiar su correo'
        })
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, {new:true})

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

    const uid = req.params.id;
        
    try {

        const usuarioDB = await Usuario.findById(uid);

        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario'
            })
        };
        await Usuario.findByIdAndDelete(uid);
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
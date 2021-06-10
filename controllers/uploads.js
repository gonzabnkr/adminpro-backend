const path = require ('path');
const { response } = require("express");
const { v4 : uuidv4 } = require ('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");
const fs = require('fs')



const fileUpload = (req,res = response) =>{

    const tipo = req.params.tipo
    const uid = req.params.id
    


    const tiposValidos = ['hospitales','medicos','usuarios'];
    if (!tiposValidos.includes(tipo)){
        return res.status(400).json({
            ok:false,
            msg: 'no es un tipo valido'
        })
    }
    
    //Validar que se envie algun archivo

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se envio ningun archivo'
        });
    }
    
    //procesar imagen   

    const file = req.files.imagen;

   
    const nombreCortado = file.name.split('.');
    const ext = nombreCortado[nombreCortado.length-1]

    //validar extension
    const extValidadas = ['png','jpg','pgeg','gif'];
    if(!extValidadas.includes(ext)){
        return res.status(400).json({
            ok:false,
            msg: 'Extension no soportada'
        })
    }

    //Generar nombre del archivo

    const nombreArchivo = `${uuidv4()}.${ext}`;

    //path guardar imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`

    //mover imagen al path
    file.mv(path, (err) => {
        if (err){
            console.log(err)
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            })
        }
        
        //Actualizar BBDD

        actualizarImagen(tipo, uid, nombreArchivo)
    
        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        })
        
      });

}

const retornaImagen = (req,res = response)=>{
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    //imagenPorDefecto
    if (fs.existsSync(pathImg)){
        res.sendFile(pathImg)
    }else{
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg)
    }



    

}
module.exports={
    fileUpload,
    retornaImagen
}
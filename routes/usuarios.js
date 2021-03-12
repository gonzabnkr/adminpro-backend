/*
Ruta: /api/usuarios
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getUsuarios,crearUsuario, actualizarUsuario,deleteUsuario } = require('../controllers/usuarios');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get( '/', validarJWT, getUsuarios )
router.post( '/',
    [
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('password','La constraseña es obligatoria').not().isEmpty(),
        check('email','El correo es obligatorio').isEmail(),
        validarCampos,
    ], 
    crearUsuario
);

router.put('/:id',
    [
        validarJWT,
        check('nombre','El nombre es obligatorio').not().isEmpty(),
        check('email','El correo es obligatorio').isEmail(),
        validarCampos,
    ], 
    actualizarUsuario
)
router.delete('/:id',
    [
        validarJWT,
        validarCampos,
    ], 
    deleteUsuario
)


module.exports = router;
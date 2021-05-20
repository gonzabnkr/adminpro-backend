/*
Ruta: /api/hospital;
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { borrarHospital,actualizarHospital,crearHospital,getHospitales } = require('../controllers/hospital');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get( '/', getHospitales )

router.post( '/',
    [
        validarJWT,
        check('nombre', 'Nombre del hospital es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    crearHospital
);

router.put('/:id',
    [
        validarJWT,
        check('nombre', 'Nombre del hospital es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    actualizarHospital
)
router.delete('/:id',
    
    borrarHospital
)

module.exports = router;


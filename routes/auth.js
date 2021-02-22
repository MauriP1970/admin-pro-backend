/*
    Ruta: api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { login } = require ('../controllers/auth')

const router = Router();

router.post( '/', 
    [
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'Correo electronico inválido').isEmail(),
        validarCampos
    ], 
    login
);


module.exports = router;
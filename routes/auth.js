/*
    Ruta: api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { login, googleSignIn, renewToken } = require ('../controllers/auth')

const router = Router();

router.post( '/', 
    [
        check('password', 'El password es obligatorio').not().isEmpty(),
        check('email', 'Correo electronico inválido').isEmail(),
        validarCampos
    ], 
    login
);

router.post( '/google', 
    [
        check('token', 'El token es obligatorio').not().isEmpty(),
        validarCampos
    ], 
    googleSignIn
);

router.get( '/renew', 
    validarJWT, 
    renewToken
);


module.exports = router;
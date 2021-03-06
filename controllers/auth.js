const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        
        // Verificar email
        const usuarioDB = await Usuario.findOne( { email });

        if (!usuarioDB){
            res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese email'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword){
            res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }

        // Generar token - JWT
        const token = await generarJWT( usuarioDB.id );
        
        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};

const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;

    try {
        
        const { name, email, picture } = await googleVerify(googleToken);
        
        const usuarioDB = await Usuario.findOne( { email });
        let usuario;

        if (!usuarioDB){
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();

        // Generar token - JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Token no correcto'
        });
    }
};


module.exports = {
    login,
    googleSignIn
}
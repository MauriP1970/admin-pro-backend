const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

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


module.exports = {
    login
}
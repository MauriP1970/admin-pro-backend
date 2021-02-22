const { response } = require('express');
const bcrypt = require('bcryptjs');

const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/usuario');

const getUsuarios = async(req, res) => {

    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuarios
    });

};

const crearUsuarios = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const existeUsuario = await Usuario.findOne( { email });

        if (existeUsuario){
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con el mismo email'
            });
        }

        const usuario = new Usuario( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt);

        // Guardar usuario
        await usuario.save();

        // Generar token - JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

};

const actualizarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if (!usuarioDB){
            res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        // actualizaciones
        const { password, google, email, ...campos}  = req.body;

        if (usuarioDB.email !== email){
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail){
                res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email;

        const usuarioaActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuario: usuarioaActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
};

const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id;

    try {
        
        const usuarioDB = await Usuario.findById( uid );

        if (!usuarioDB){
            res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario Eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

};

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario
}
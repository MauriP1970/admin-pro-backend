const path = require('path');
const fs = require('fs');

const { response } = require('express');

const { v4: uuidv4 } = require('uuid');

const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = async(req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (!tiposValidos.includes(tipo)){
        return res.status(400).json({
            ok: false,
            msg: 'El tipo seleccionado no es medico, usuario u hospital'
        });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se selecciono ningun archivo'
        });
    }

    // Procesar archivo
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[ nombreCortado.length -1 ];

    const entensionesValidas = ['jpg', 'jpeg', 'gif', 'png'];
    if (!entensionesValidas.includes(extensionArchivo)){
        return res.status(400).json({
            ok: false,
            msg: 'El tipo de archivo seleccionado no es valido'
        });
    }

    const nombreArchivo = `${ uuidv4()}.${ extensionArchivo }`;

    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    file.mv(path, (err) => {
        if (err){
            console.log(err);
            res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }
    
        actualizarImagen(tipo, id, nombreArchivo);

        res.json({
            ok: true,
            msg: "Archivo subido",
            nombreArchivo
        });

    });

};

const retornaImagen = (req, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${ tipo }/${ foto }`);

    if (fs.existsSync(pathImg)){
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.png`);
        res.sendFile(pathImg);
    }
}

module.exports = {
    fileUpload,
    retornaImagen
}
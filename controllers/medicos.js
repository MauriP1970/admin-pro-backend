const { response } = require('express');

const Medico = require('../models/medico');

const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find()
                            .populate("usuario","nombre img")
                            .populate("hospital", "nombre img");

    res.json({
        ok: true,
        medicos
    });

};

const crearMedico = async(req, res = response) => {

    try {
        const uid = req.uid;
        const medico = new Medico( {
            usuario: uid,
            ...req.body 
        });

        const medicoDB =  await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

};

const actualizarMedico = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        
        const medico = await Medico.findById( id );

        if (!medico){
            res.status(404).json({
                ok: false,
                msg: 'No existe un medico con ese id'
            });
        }

        const cambiosHospital = { 
            ...req.body,
            usuario: uid
        };

        const medicoActualizado = await Medico.findByIdAndUpdate( id, cambiosHospital, { new: true, useFindAndModify:false } );

        res.json({
            ok: true,
            medico: medicoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

};

const borrarMedico = async(req, res = response) => {

    const id = req.params.id;

    try {
        
        const medico = await Medico.findById( id );

        if (!medico){
            res.status(404).json({
                ok: false,
                msg: 'No existe un medico con ese id'
            });
        }

        await Medico.findByIdAndDelete( id );

        res.json({
            ok: true
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}
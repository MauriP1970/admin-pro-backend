const { response } = require('express');

const Hospital = require('../models/hospital');

const getHospitales = async(req, res = response) => {

    const hospitales = await Hospital.find()
                                .populate("usuario","nombre img");

    res.json({
        ok: true,
        hospitales
    });

};

const crearHospital = async(req, res = response) => {

    try {
        const uid = req.uid;
        const hospital = new Hospital( {
            usuario: uid,
            ...req.body 
        });
        

        const hospitalDB =  await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

};

const actualizarHospital = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        
        const hospital = await Hospital.findById( id );

        if (!hospital){
            res.status(404).json({
                ok: false,
                msg: 'No existe un hospital con ese id'
            });
        }

        const cambiosHospital = { 
            ...req.body,
            usuario: uid
        };

        const hospitalActualizado = await Hospital.findByIdAndUpdate( id, cambiosHospital, { new: true, useFindAndModify:false } );

        res.json({
            ok: true,
            hospital: hospitalActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

};

const borrarHospital = async(req, res = response) => {

    const id = req.params.id;

    try {
        
        const hospital = await Hospital.findById( id );

        if (!hospital){
            res.status(404).json({
                ok: false,
                msg: 'No existe un hospital con ese id'
            });
        }

        await Hospital.findByIdAndDelete( id );

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
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}
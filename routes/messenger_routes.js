/* IMPORTS */
const express = require('express');
const consulter = require('../javascript/consult_logic'); // <-----------WATCH OUT HERE!
const all_consulter = require('../javascript/showall_logic'); // <-----------WATCH OUT HERE!
const exceler = require('../javascript/excel'); // <-----------WATCH OUT HERE!
const sender = require('../javascript/send_logic'); // <-----------WATCH OUT HERE!
const setter = require('../javascript/setstate_logic'); // <-----------WATCH OUT HERE!

/* VARIABLES GLOBALES */
const routes = express.Router();

/* CONSULTAR ENVIO (POR CODIGO DE ENVIO) */
routes.route('/consult/:tipo_consulta').get((req, res) => {
    try {
        consulter.consult_envio(req, res);
        console.log("Sucessfull consulting!");
    } catch (error) {
        console.log('Caught error on consult: ', error);
        res.status(500).send({
            message: "Could not consult the file: " + req.file.originalname,
        });
    }
});
/* CONSULTAR ENVIOS DE TODOS */
routes.route('/consult_all').get((req, res) => {
    try {
        all_consulter.mostrar_registros(req, res);
        console.log("Sucessfull all consulting!");
    } catch (error) {
        console.log('Caught error on consult all: ', error);
        res.status(500).send({
            message: "Could not consult all the fail: " + req.file.originalname,
        });
    }
});

/* ESTABLECER ESTADO DEL ENVIO (POR CODIGO DE ENVIO) */
routes.route('/set_estado/:codigo_envio').put((req, res) => {
    try {
        setter.set_estado(req, res);
        console.log("Sucessfull setting!");
    } catch (error) {
        console.log('Caught error on setting: ', error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
});
/* REGISTRAR UN NUEVO ENVIO Y SU CODIGO (DADA SU DESCRIPCION JSON) */
routes.route('/send').post((req, res) => {
    try {
        sender.send(req, res);
        console.log("Sucessfull insertion!");
    } catch (error) {
        console.log('Caught error on sending: ', error);
        res.status(500).send({
            message: "Could not send the file: " + req.file.originalname,
        });
    }
});
/* ALMACENAR EN MONGODB LOS REGISTROS DE ENVIOS (DADOS EN UN ARCHIVO CSV) */
routes.route('/upload_csv').post(exceler.upload.single('file'), (req, res) => {
    try {
        console.log(req.file);
        if (req.file == undefined) {
            res.status(400).send({
                message: "Please upload a CSV file",
            });
        }
        exceler.upload_local_file(req, res);
    } catch (error) {
        console.log('Caught error: ', error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
});


module.exports = routes;
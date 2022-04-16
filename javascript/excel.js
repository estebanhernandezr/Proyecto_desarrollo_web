const fs = require('fs'); 
const csv = require('csv-parser');
const multer = require('multer');
const database = require('../database/connection');
const { builtinModules } = require('module');
const { workerData } = require('worker_threads');

var file_path = "../../data/";
let inputFilePath = file_path;
const local_upload = async function(req, res) {
    var csv_rows = [];
    fs.createReadStream(inputFilePath+req.file.originalname)
    .pipe(csv())
    .on('data', function(data) {
        console.log('----> csv file has been opened succesfully.. <----');
        try {
            console.log(data);
            csv_rows.push(data);
        }
        catch(err) {
            console.log("Caught error - ", err);
        }
    })
    .on('end', function() {
        const connection = database.get_database();
        let collection_name = "sent_registers";
        csv_rows.forEach(row => {
            let new_row = {
                codigo_envio: row.cod_envio,
                nombre_emisor: row.address_from_name,
                email_emisor: row.address_from_email,
                calle_emisor: row.address_from_street1,
                ciudad_emisor: row.address_from_city,
                provincia_emisor: row.address_from_province,
                //postal_emisor: row.address_from_postal_code,
                pais_emisor: row.address_from_country_code,

                nombre_receptor: row.address_to_name,
                email_receptor: row.address_to_email,
                calle_receptor: row.address_to_street1,
                ciudad_receptor: row.address_to_city,
                provincia_receptor: row.address_to_province,
                //postal_receptor: row.address_to_postal_code,
                pais_receptor: row.address_from_country_code,
                cedula_emisor: row.cedula_emisor,
                cedula_receptor: row.cedula_receptor,

                estado: "Cliente ha recibido paquete",
                last_modified: new Date(),
            };
            connection.collection(collection_name).insertOne(new_row);
        });
        res.status(200).send({
            message: "Done: processed " + csv_rows.length + " register rows..",
        });
    });
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../../data', '/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.filename + '-' + Date.now() + '-' + file.originalname);
    },
});

const csv_filter = (req, file, cb) => {
    if (file.mimetype.includes('csv')) {
        cb(null, true);
    } else {
        cb('Please upload a csv file', false);
    }
};

const upload = multer({ storage: storage, fileFilter: csv_filter });

module.exports = {
    upload_local_file: local_upload,
    upload: upload,
};
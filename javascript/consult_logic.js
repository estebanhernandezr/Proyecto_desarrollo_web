const database = require('../database/connection');

const consult_register = async function(req, res) {
    const connection = database.get_database();
    let collection_name = "sent_registers";
    let consult_type = req.params.tipo_consulta;

    if (consult_type == 'code') {
        let query = {
            codigo_envio: req.body.codigo_envio,
        }; 
        connection.collection(collection_name).find(query)
        .toArray()
        .then(items => {
            res.status(200).send({
                coincidencias: items,
            });
        })
        .catch(err => console.error(`Failed to find documents: ${err}`));
    } else if (consult_type == 'cedula') {
        let query = {
            cedula_receptor: req.body.cedula,
        };
        connection.collection(collection_name).find(query)
        .toArray()
        .then(items => {
            res.status(200).send({
                coincidencias: items,
            });
        })
        .catch(err => console.error(`Failed to find documents: ${err}`));
    } else {
        res.status(400).send({
            message: "The type of consult: " + consult_type + " is not a valid type of consult!",
        });
    }
}


module.exports = {
    consult_envio: consult_register,
};
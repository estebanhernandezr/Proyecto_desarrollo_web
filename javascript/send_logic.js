const database = require('../database/connection');

const send_register = async function(req, res) {
    const connection = database.get_database();
    let collection_name = "sent_registers";
    const new_register = {
        codigo_envio: "ORD",

        nombre_emisor: req.body.nombre_emisor,
        email_emisor: req.body.email_emisor,
        calle_emisor: req.body.calle_emisor,
        ciudad_emisor: req.body.ciudad_emisor,
        provincia_emisor: req.body.provincia_emisor,
        pais_emisor: req.body.pais_emisor,

        nombre_receptor: req.body.nombre_receptor,
        email_receptor: req.body.email_receptor,
        calle_receptor: req.body.calle_receptor,
        ciudad_receptor: req.body.ciudad_receptor,
        provincia_receptor: req.body.provincia_emisor,
        pais_receptor: req.body.pais_receptor,

        estado: "Recibido",
        last_modified: new Date(),
    };

    connection.collection(collection_name).count().then(val => {
        let tail = val.toString();
        for (let idx = 0; idx < 5-tail.length; idx++) {
            new_register.codigo_envio += "0";
        }
        new_register.codigo_envio += (val+1).toString();

        connection.collection(collection_name).insertOne(new_register, function(err, _result) {
            if (err) {
                res.status(400).send({ message: `Error inserting the item!`});
            } else {
                res.status(200).send({message: `Document inserted with code: ${new_register.codigo_envio}`});
            }
        });
    });
}


module.exports = {
    send: send_register,
};
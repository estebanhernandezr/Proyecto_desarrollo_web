const database = require('../database/connection');

const show_registers = async function(req, res) {
    const connection = database.get_database();
    let collection_name = "sent_registers";

    connection.collection(collection_name).find().toArray().then(items => {
        let lista_registros_clientes = [];
        items.forEach(item => {
            let flag_emisor = true;
            let flag_receptor = true;
            lista_registros_clientes.forEach(cliente => {
                if (item.nombre_emisor == cliente.nombre) {
                    cliente.enviados.push(item);
                    flag_emisor = false;
                } else if (item.nombre_receptor == cliente.nombre) {
                    cliente.recibidos.push(item);
                    flag_receptor = false;
                }
            });
            if (flag_emisor) {
                const cliente_emisor = {
                    nombre: item.nombre_emisor,
                    enviados: [item],
                    recibidos: [],
                };
                lista_registros_clientes.push(cliente_emisor);
            } else if (flag_receptor) {
                const cliente_receptor = {
                    nombre: item.nombre_receptor,
                    enviados: [],
                    recibidos: [item],
                };
                lista_registros_clientes.push(cliente_receptor);
            }
        });
        res.status(200).send({
            message: lista_registros_clientes,
        });
    });
};

/*const show_registers = async function(req, res) {
    const connection = database.get_database();
    let collection_name = "sent_registers";

    let lista_usuarios = [];
    connection.collection(collection_name).distinct('nombre_emisor')
    .then(emisores => {
        emisores.forEach(emisor => {
            var cliente = {
                nombre: emisor,
                enviados: [],
                recibidos: [],
            }
            lista_usuarios.push(cliente);
        });

        emisores.forEach(emisor => {
            const query = {
                nombre_emisor: emisor,
            };
            connection.collection(collection_name).find(query)
            .toArray()
            .then(items => {
                items.forEach(item => {
                    lista_usuarios.forEach(usuario => {
                        if (item.nombre_emisor == usuario.nombre) {
                            console.log("----------> CAUGHT CONDITIONAL! <-------")
                            usuario.enviados.push(item);
                        }
                    });
                });
            })
            .catch(err => console.error(`Failed to find documents: ${err}`));
        });
        connection.collection(collection_name).distinct('nombre_receptor')
        .then(receptores => {
            console.log(receptores);
            receptores.forEach(receptor => {
                var cliente = {
                    nombre: receptor,
                    enviados: [],
                    recibidos: [],
                }
                lista_usuarios.push(cliente);
            });
            receptores.forEach(receptor => {
                const query = {
                    nombre_receptor: receptor,
                };
                connection.collection(collection_name).find(query)
                .toArray()
                .then(items => {
                    items.forEach(item => {
                        lista_usuarios.forEach(usuario => {
                            if (item.nombre_receptor == usuario.nombre) {
                                console.log("--------> DONE <-------------------");
                                usuario.recibidos.push(item);
                            }
                        });
                    });
                    res.status(200).send({
                        message: lista_usuarios,
                    });
                })
                .catch(err => console.error(`Failed to find documents: ${err}`));
            });
        });
    });
}*/

module.exports = {
    mostrar_registros: show_registers,
};
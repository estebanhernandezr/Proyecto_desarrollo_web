/*VARIABLES DE ENTORNO*/
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
//require('dotenv').config({path: '../.env'});
const db_connection = process.env.DB_CONNECTION;
const db_name = process.env.DB_NAME;

/*PARÁMETROS*/
const {MongoClient} = require('mongodb');

/*VARIABLES GLOBALES*/
const client = new MongoClient(db_connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
let connection;

/*EXPORTS*/
module.exports = {
    connect_to_server: function(callback) {
        client.connect(function(err, dbobj) {
            if (err || !dbobj) {
                return callback(err);
            } else {
                connection = dbobj.db(db_name);
                console.log("Sucessfully connected to mongodb");
                return callback();
            }
        });
    },
    get_database: function() {
        return connection;
    },
};
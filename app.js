/*VARIABLES DE ENTORNO*/
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
//require('dotenv').config({path: '../.env'});
/*PARÁMETROS*/
const express = require('express');
const cors = require('cors');
const database = require('./database/connection');
const scrapper = require('./javascript/scrap.js'); // <-----------WATCH OUT HERE!
const apier = require('./javascript/api.js'); // <-----------WATCH OUT HERE!

/*VARIABLES GLOBALES*/
const port = process.env.PORT || 5000;
const app = express();

/*BODY*/
app.use(cors());
app.use(express.json());
app.use(require('./routes/messenger_routes'));

app.use(function(err, _req, res, next) {
    console.error(err.stack);
    res.status(500).send('error in the app!');
});

database.connect_to_server(function(err) {
    if (err) {
        console.log('Error in db connection!!!');
        console.error(err);
        process.exit();
    }

    // start the Express server
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
        console.log('----> Just checking everything works correctly here <----');
        /*scrapper.get_scrapped_data().then(val => {
            console.log(val)
            let movies = val['entries'];
            movies.forEach(movie => {
                database.insertOne(movie);
            });
            console.log('----> Aquí terminamos <----');
        });*/
        console.log('----> Aquí empezamos con la API! <----');
        apier.get_api_info();
    });
});
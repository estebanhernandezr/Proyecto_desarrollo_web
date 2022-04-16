/*PARÁMETROS*/
const express = require('express');
const database = require('../database/connection');
const ObjectID = require('mongodb').ObjectId;
const scrapper = require('../javascript/scrap'); // <-----------WATCH OUT HERE!

/*VARIABLES GLOBALES*/
const routes = express.Router();
var collection_name = 'packets';

/*EXPORTS*/
routes.route('/').get(async function (_req, res) {
    res.send('Messenger server is runnning already...')
    const connection = database.get_database();
    connection.collection(collection_name).remove( { } );
    const options = { upsert: true };
    scrapper.get_scrapped_data().then(val => {
        console.log(val)
        let movies = val['entries'];
        movies.forEach(movie => {
            connection.collection(collection_name).insertOne(movie);
        });
        console.log('----> Aquí terminamos <----');
    });
});

routes.route('/packets').get(async function(_req, res) {
    const connection = database.get_database();
    connection.collection(collection_name).find({

    }).toArray(function(err, result) {
        if (err) {
            res.status(400).send('Error finding the item');
        } else {
            res.json(result);
        }
    });
});

module.exports = routes;
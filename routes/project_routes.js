/* IMPORTS */
const express = require('express');
const scraper = require('../javascript/scrap'); // <-----------WATCH OUT HERE!
const apier = require('../javascript/api'); // <-----------WATCH OUT HERE!

/* VARIABLES GLOBALES */
const routes = express.Router();

/* SCRAPPING OF metacritic */
routes.route('/pre_main_page').get((req, res) => {
    try {
        scraper.get_scrapped_data(req, res);
        console.log("Sucessfull scrapping!");
    } catch (error) {
        console.log('Caught error on scrapping: ', error);
        res.status(500).send({
            message: "Could not scrap: metacritic",
        });
    }
});
/* API REQUESTING of Netflix, AmazonPrime and DisneyPlus */
routes.route('/post_main_page').get((req, res) => {
    try {
        //apier.get_api_info_amazon(req, res);
        //apier.get_api_info_disney(req, res);
        apier.get_api_info_netflix(req, res);
        console.log("Sucessfull api requesting!");
        res.status(200).send({
            message: "Sucessful api request!",
        });
    } catch (error) {
        console.log('Caught error on api request: ', error);
        res.status(500).send({
            message: "Could not api request!",
        });
    }
});

module.exports = routes;
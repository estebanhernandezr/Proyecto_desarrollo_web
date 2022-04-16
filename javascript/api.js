const axios = require("axios");
const database = require('../database/connection');

const request_api = async(key, serv) => {
    const options = {
    method: 'GET',
    url: 'https://streaming-availability.p.rapidapi.com/search/basic',
    params: {
        keyword: key,
        country: 'co',
        service: serv,
        type: 'movie',
        //genre: '18',
        //page: '2',
        //output_language: 'en',
        //language: 'en'
    },
    headers: {
        'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com',
        'X-RapidAPI-Key': '2422ea85dfmsh0ff697f8f4ce6b6p12175ejsnd80b601d343c'
    }
    };

    axios.request(options).then(function (response) {
        console.log(response.data.results.lenght);
    }).catch(function (error) {
        console.error(error);
    });
}

function wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
        end = new Date().getTime();
    }
}

module.exports = {
    get_api_info_amazon: async function(key, req, res) {
        return request_api(key, 'prime');
    },
    get_api_info_disney: async function(key, req, res) {
        return request_api(key, 'disney');
    },
    get_api_info_netflix: async function(key, req, res) {
        const connection = database.get_database();
        let collection_name = "coleccion_estrenos";
        connection.collection(collection_name).find({}).toArray().then(items => {
            let count = 0;
            items.forEach(item => {
                if (count >= 8) {
                    count = 0;
                    wait(1000);  // 1 seconds in milliseconds
                } else {
                    count += 1;
                }
                request_api(item.title, 'netflix');
            });
        });
    },
};
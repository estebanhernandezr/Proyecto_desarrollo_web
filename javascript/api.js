const axios = require("axios");

const request_api = async(serv) => {
    const options = {
    method: 'GET',
    url: 'https://streaming-availability.p.rapidapi.com/search/basic',
    params: {
        keyword: 'The batman',
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
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    });
}

module.exports = {
    get_api_info: async function() {
        return request_api('netflix');
    },
};
//const fetch = require('node-fetch');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cheerio = require('cheerio');
const { val } = require('cheerio/lib/api/attributes');
const database = require('../database/connection');

// objects to store information
const movie = {
    title: "default_title",
    meta: "default_metadata",
    descrp: "default_descrp"
};

// function to get the raw data from URL
const get_raw_data = (URL) => {
    return fetch(URL)
        .then((response) => response.text())
        .then((data) => {
        return data;
    });
};

// function to get the parsed data from URL
const get_data = async (URL) => {
    let movie_titles = [];
    let movie_medata = [];
    let movie_descrp = [];

    var movies = {
        entries: [],
    }

    const raw_data = await get_raw_data(URL);

    // parsing the data
    const parsed_data = cheerio.load(raw_data);

    // extracting the wanted element
    const loaded_cheerio = parsed_data('.title_bump');
    const title_bump = loaded_cheerio['0'];
    //console.log(title_bump);
    const title_bump_children = title_bump['children'];
    title_bump_children.forEach((title_bump_child) => {
        if (title_bump_child['name'] == 'div') {
            if ((title_bump_child['attribs']['class'] == 'browse_list_wrapper one browse-list-large') 
            || (title_bump_child['attribs']['class'] == 'browse_list_wrapper two browse-list-large') 
            || (title_bump_child['attribs']['class'] == 'browse_list_wrapper three browse-list-large') 
            || (title_bump_child['attribs']['class'] == 'browse_list_wrapper four browse-list-large')) {
                const div_children = title_bump_child['children'];
                div_children.forEach((div_child) => {
                    if (div_child['name'] == 'table') {
                        const table_children = div_child['children'];
                        table_children.forEach((table_child) => {
                            if (table_child['name'] == 'tbody') {
                                const tbody_children = table_child['children'];
                                tbody_children.forEach((tbody_child) => {
                                    if (tbody_child['name'] == 'tr' && tbody_child['attribs']['class'] != 'spacer') {
                                        const tr_children = tbody_child['children'];
                                        tr_children.forEach((tr_child) => {
                                            if (tr_child['name'] == 'td' && (tr_child['attribs']['class'] == 'clamp-summary-wrap')) {
                                                const td_children = tr_child['children'];
                                                td_children.forEach((td_child) => {
                                                    if (td_child['name'] == 'a') {
                                                        const a_children = td_child['children'];
                                                        a_children.forEach((a_child) => {
                                                            if (a_child['name'] == 'h3') {
                                                                const h3_children = a_child['children'];
                                                                h3_children.forEach((h3_child) => {
                                                                    if (h3_child['type'] == 'text') {
                                                                        //console.log(h3_child['data']);
                                                                        movie_titles.push(h3_child['data']);
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    } else if (td_child['name'] == 'div' && td_child['attribs']['class'] == 'clamp-details') {
                                                        const clamp_details_children = td_child['children'];
                                                        clamp_details_children.forEach((clamp_details_child) => {
                                                            if (clamp_details_child['name'] == 'span') {
                                                                const span_children = clamp_details_child['children'];
                                                                span_children.forEach((span_child) => {
                                                                    if (span_child['type'] == 'text') {
                                                                        //console.log(span_child['data']);
                                                                        movie_medata.push(span_child['data']);
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    } else if (td_child['name'] == 'div' && td_child['attribs']['class'] == 'summary') {
                                                        const summary_children = td_child['children'];
                                                        summary_children.forEach((summary_child) => {
                                                            if (summary_child['type'] == 'text') {
                                                                //console.log(summary_child['data']);
                                                                movie_descrp.push(summary_child['data']);
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });
    //console.log(movie_titles);
    //console.log(movie_medata);
    //console.log(movie_descrp);
    movie_titles.forEach((title, idx) => {
        let movie ={
            title: movie_titles[idx],
            meta: movie_medata[idx],
            descrp: movie_descrp[idx]
        };
        movies['entries'].push(movie);
    });
    //console.log(movies);
    return movies;
};

// URL for data
const URL = 'https://www.metacritic.com/browse/movies/release-date/theaters/date';
// invoking the main function
//get_data(URL);

module.exports = {
    get_scrapped_data: async function(req, res) {
        const connection = database.get_database();
        let collection_name = "coleccion_estrenos";
        get_data(URL).then(val => {
            let movies = val['entries'];
            connection.collection(collection_name).insertMany(movies, function(err, _result) {
                if (err) {
                    res.status(400).send({ message: `Error on SCRAPPING!`});
                } else {
                    res.status(200).send({message: `Sucessed on SCRAPPING!`});
                }
            });
            console.log('----> Aqu?? terminamos el SCRAPPING <----');
        });
    },
};


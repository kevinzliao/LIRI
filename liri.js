require("dotenv").config();
var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

if (process.argv[2] == 'my-tweets') {
    client.get('statuses/user_timeline', { screen_name: 'KevinLi03771662', count: 20 }, function (error, tweets, response) {
        if (!error && response.statusCode === 200) {
            for (i = 0; i < tweets.length; i++) {
                console.log("Tweet Text: " + tweets[i].text + " Tweet Timestamp:" + tweets[i].created_at);
            }
        }
    });
}

if (process.argv[2] == 'spotify-this-song') {
    if (!process.argv[3]) {
        spotify
            .search({ type: 'track', query: 'The Sign' })
            .then(function (response) {
                console.log(`Artist(s): ${response.tracks.items[0].album.artists[0].name}
            Song name: ${response.tracks.items[0].name}
            Preview Link: ${response.tracks.items[0].album.external_urls.spotify}
            Album Name: ${response.tracks.items[0].album.name}
            `)
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    else {
        spotify
            .search({ type: 'track', query: process.argv[3] })
            .then(function (response) {
                console.log(`Artist(s): ${response.tracks.items[0].album.artists[0].name}
            Song name: ${response.tracks.items[0].name}
            Preview Link: ${response.tracks.items[0].album.external_urls.spotify}
            Album Name: ${response.tracks.items[0].album.name}
            `)
            })
            .catch(function (err) {
                console.log(err);
            });
    }
}

if (process.argv[2] == 'movie-this') {
    if (!process.argv[3]) {
        movieName = 'Mr. Nobody.'
    }
    else {
        movieName = process.argv[3];
    }
    request("http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            // Parse the body of the site and recover just the imdbRating
            // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
            console.log(JSON.parse(body));
            console.log(`Movie title: ${JSON.parse(body).Title}
            Year: ${JSON.parse(body).Year}
            IMDB Rating: ${JSON.parse(body).imdbRating}
            Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[2].Value}
            Country of Production: ${JSON.parse(body).Country}
            Language: ${JSON.parse(body).Language}
            Plot: ${JSON.parse(body).Plot}
            Actors: ${JSON.parse(body).Actors}
            `);
        }
    });
}

if (process.argv[2] == 'do-what-it-says') {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        spotify
            .search({ type: 'track', query: data.split(',')[1] })
            .then(function (response) {
                console.log(`Artist(s): ${response.tracks.items[0].album.artists[0].name}
            Song name: ${response.tracks.items[0].name}
            Preview Link: ${response.tracks.items[0].album.external_urls.spotify}
            Album Name: ${response.tracks.items[0].album.name}
            `)
            })
            .catch(function (err) {
                console.log(err);
            });
    });
}      

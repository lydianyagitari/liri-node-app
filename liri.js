//require module for .env file
require("dotenv").config();

// variables for access to the keys information and file system 
var keys = require("./keys.js");
var request = require('request');
var moment = require('moment');
var Spotify = require('node-spotify-api');
var fs = require("fs");
// node arg variables, spotify keys and search variables
var spotify = new Spotify(keys.spotify);
var nodeAppArgs = process.argv;
var liriApp = process.argv[2];
var search = "";

// sets user input to a minimum of 3 in the CLI
for (var i = 3; i < nodeAppArgs.length; i++) {

    if (i > 3 && i < nodeAppArgs.length) {
        search = search + " " + nodeAppArgs[i];
    } else {

        search += nodeAppArgs[i];

    }
}

//Navigate between liri commands in the cl with a switch
switch (liriApp) {
    //Add cl for the bands API
    case "concert-this":
        if (search) {
            //state that Liri is looking for concerts for the artist
            console.log("\nThese are the concerts for you " + search)
            // call the findConcert function
            findConcert(search);
        }
        break;
        // add cl for Spotify API
    case "spotify-this-song":
        if (search) {
            // state that Liri is spotifying the song
            console.log("\nSpotifying " + search)
            // call the spotifySong function
            spotifySong(search);
            // else if Liri never found a song, just search all the small things
        } else {
            var search = "All The Small Things"
            spotifySong(search)
        }
        break;
        //  add cl for imdb API
    case "movie-this":
        if (search) {
            // state that IMDB is running a search
            console.log("\nchecking IMDB for " + search + ".")
            // call the findMovie function
            findMovie(search);
        } else {
            var search = "Mr. Nobody"
            findMovie(search);
        }
        break;

        // add cl do-what-it-says
    case "do-what-it-says":
        doAsAppWants();
        break;

    default:
        console.log("INTRUCTIONS FOR THIS CLI APP \n _____________________________\n")
        console.log("'concert-this' + the artist\n, 'spotify-this-song' + the song title\n, 'movie-this' + the movie title\n, or 'do-what-it-says' to run the random.txt file\n")

}

// function to find a concert
function findConcert(search) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp";
    request(queryUrl, function (error, response, body) {

        //  if no error and statusCode is 200
        if (!error && response.statusCode === 200) {
            // loop through the body
            for (i = 0; i < body.length; i++) {

                // set the the data to a variable 
                var concertData = JSON.parse(body)[i]

                // using moments, display venue, city and date data results
                console.log("...")
                console.log("Venue: " + concertData.venue.name)
                console.log("---------------------------")
                console.log("City: " + concertData.venue.city)
                console.log("---------------------------")
                console.log(moment(concertData.datetime).format("MM/DD/YYYY"));
            }
        }
    });
}

// function for using Spotify 
function spotifySong(search) {
    // add the spotify get request from the docs
    spotify.search({
        type: 'track',
        query: search
    }, function (error, data) {
        // if there is an error, console.log the error
        if (error) {
            return console.log('There was an Error! ' + err);
            // else
        } else {
            // console.log the data of the search
            var songRes = data.tracks.items[0]
            console.log("\n...\n")
            console.log("Artist: " + songRes.artists[0].name);
            console.log("---------------------------")
            console.log("Song Title: " + songRes.name);
            console.log("---------------------------")
            console.log("Listen Here: " + songRes.preview_url);
            console.log("---------------------------")
            console.log("Album Title: " + songRes.album.name);
            console.log("____________________________")
        }
    })
}

// function for searching Movie info
function findMovie(search) {
    var queryUrl = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        // If response status code is 200, means its successful,..then return movie info/data
        if (!error && response.statusCode === 200) {

            // set the data to a variable
            var movieRes = JSON.parse(body)
            // console log the movie data
            console.log("Movie Title: " + movieRes.Title)
            console.log("---------------------------")
            console.log("Release Year: " + movieRes.Year)
            console.log("---------------------------")
            console.log("IMBD Rating: " + movieRes.imdbRating)
            console.log("---------------------------")
            console.log("Rotten Tomatoes Rating: " + movieRes.Ratings[0].Value)
            console.log("---------------------------")
            console.log("Produced In: " + movieRes.Country)
            console.log("---------------------------")
            console.log("Language: " + movieRes.Language)
            console.log("---------------------------")
            console.log("Actors: " + movieRes.Actors)
            console.log("---------------------------")
            console.log("\nPlot: " + movieRes.Plot)
            console.log("____________________________")
        }
    });
}
//this function will do "i like it that way"
function doAsAppWants() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        // an error is thrown if fs cannot be read.
        if (error) {
            return console.log(error);
        }
        // use data.split to make the data more readable)
        var liriComd = data.split(",")
        // if the command liriComd[0] is "concert-this" run the concert function for "spotify this song"
        if (liriComd[0] === "spotify-this-song") {
            var search = liriComd[1]
            spotifySong(search);
            console.log(search)

        }
    });
};
// require everything need to run this CLA
js
require("dotenv").config();


// able to access your keys information 

var keys = require("./keys.js");
var request = require('request');
var moment = require('moment');
var Spotify = require('node-spotify-api');
var fs = require("fs");

// set variables
var spotify = new Spotify(keys.spotify);

var nodeArgs = process.argv;

var liri =  process.argv[2];

var search = "";




// allow the user to enter in names longer than 1 word 
    // for loop
    // set i = 3 so it will start at index of 3 for command line purposes
for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
  
      search = search + " " + nodeArgs[i];
  
    }
  
    else {
  
        search += nodeArgs[i];
  
    }
  }
//   console.log(artist)

// use Switch to navigate between liri target points in the command line
  switch (liri) {
    // add commandline for the bands API
    case "concert-this":
    if (search){
        // console.log that Liri is looking for concerts for the entered artist
        console.log("\nOkay...I've found these concerts for " + search + ".")
        // call the findConcert function
        findConcert(search);
    }
    break;
    // add command line for Spotify API
    case "spotify-this-song":
    if (search) {
        // console.log that Liri is sopotifying the song
        console.log("\nAlrighty...I will will Spotify " + search + " for you.")
        // call the spotifySong function
        spotifySong(search);
        // else (if Liri cant find the song, or the user doesnt enter one, search all the small things)
    } else {
        var search = "All The Small Things"
        spotifySong(search)
    }
    break;
    //  add command line for imdb API
    case "movie-this":
    if (search) {
        // log that Liri is searching for the movie
        console.log("\nNo problem...Let me check IMDB for " + search + ".")
        // call the getMovie function
        getMovie(search);
    } else {
        var search = "Mr. Nobody"
        getMovie(search);
    }
    break;

    // add command line do-what-it-says
    case "do-what-it-says":
        liriTakeTheWheel();
        break;

    default:
    console.log("Please enter either 'concert-this' followed by the artist, 'spotify-this-song' followed by the song title, 'movie-this' followed by the movie title, or 'do-what-it-says' to run the random.txt file. Thank you.")

}

// function for finding a concert
function findConcert (search){
request("https://rest.bandsintown.com/artists/" + search + "/events?app_id=codingbootcamp", function(error, response, body) {

//  if no error and statusCode is 200
  if (!error && response.statusCode === 200) {

        // loop through the body (response)
        for (i = 0; i < body.length; i++) {

            // set the the data to a variable 
            var concertData = JSON.parse(body)[i]

            // console.log the selected info for display---use moment for datetime display
            console.log("Here's what I found...")
            console.log("\n==========================================")
            console.log("Venue: " + concertData.venue.name)
            console.log("City: " + concertData.venue.city)
            console.log(moment(concertData.datetime).format("LLLL"));
            console.log("==========================================")
        }
        
  } 

});

}

// function for using Spotify 
function spotifySong (search) {
    // add the spotify get request from the docs
    spotify.search({ type: 'track', query: search}, function(error, data) {

        // if there is an error, console.log the error
        if (error) {

            return console.log('Error occurred: ' + err);
        
            // else
        } else {
            // console.log the data of the search
            var songData = data.tracks.items[0]
            console.log("\nHere's what I found...")
            console.log("======================================")
            console.log("Artist: " + songData.artists[0].name);
            console.log("Song Title: " + songData.name);
            console.log("Listen Here: " + songData.preview_url);
            console.log("Album Title: " + songData.album.name);
            console.log("======================================")
        } 

    })
}

// function for searching Movie info
function getMovie (search) {

    var queryUrl = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {

        // If the request is successful
        if (!error && response.statusCode === 200) {
            
            // set the data to a variable
            var movieData = JSON.parse(body)
         
            // console log the data
          console.log("\nHere's what I found...")
          console.log("======================================")
          console.log("Movie Title: " + movieData.Title)
          console.log("Release Year: " + movieData.Year)
          console.log("IMBD Rating: " + movieData.imdbRating)
          console.log("Rotten Tomatoes Rating: " + movieData.Ratings[0].Value)
          console.log("Produced In: " + movieData.Country)
          console.log("Language: " + movieData.Language)
          console.log("Actors: " + movieData.Actors)
          console.log("\nPlot: " + movieData.Plot)
          console.log("======================================")
        }
      });
}

function liriTakeTheWheel () {

    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
      
        // Then split it by commas (to make it more readable)
        var liriCommand = data.split(",")

                // if liriCommand[0] is "concert-this" run the concert function for liriCommand[1]
            if (liriCommand[0] === "spotify-this-song") {

                var search = liriCommand[1]
                spotifySong(search);
                console.log(search)

            }
      
    });
};

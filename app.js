var key = require('./keys.js');
var fs = require('fs');
var result = '';
var command = process.argv[2];
var searchName = process.argv.splice(3).join("-");


function tweets() {
    var params = { screen_name: 'tdpettersson', count: 20 };
    var requestType = "Tweets";

    key.twitterKeys.get('statuses/user_timeline', params, function(error, tweets, respond) {
        if (error) throw error;
        for (var i = 0; i < 20; i++) {
            result += tweets[i].created_at + "\n" + tweets[i].text + "\n\n";
        }
        console.log(result);
        appendLog(requestType);
    });

}

function spotify() {
    var spotify = require('spotify');
    var requestType = "Spotify Search";

    if (!searchName) {
        searchName = 'Ace Of Base The Sign';
    }

    spotify.search({ type: 'track', query: searchName }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        result = 'Artist: ' + data.tracks.items[0].artists[0].name + '\nSong Name: ' + data.tracks.items[0].name + '\nFrom Album: ' + data.tracks.items[0].album.name + '\nPreview: ' + data.tracks.items[0].preview_url;
        console.log(result);
        appendLog(requestType);

    });

}

function movie() {
    var request = require('request');
    var requestType = "Movie Search";

    if (!searchName) {
        searchName = "Mr. Nobody";
    }

    request.get('http://www.omdbapi.com/?r=json&tomatoes=true&t=' + searchName, function(error, response, movie) {
        if (!error && response.statusCode == 200) {
            movie = JSON.parse(movie);
            result = movie.Title + '\nYear: ' + movie.Year + '\nIMDB Rating: ' + movie.imdbRating + '\nCountry: ' + movie.Country + '\nLanguage: ' + movie.Language + '\nPlot: ' + movie.Plot + '\nActors: ' + movie.Actors + '\nRotten Tomatoes Rating: ' + movie.tomatoUserRating + '\nRotten Tomatoes URL: ' + movie.tomatoURL;

            console.log(result);
            appendLog(requestType);
        }
    });
}

function says() {
    var fs = require('fs');

    fs.readFile('./random.txt', 'utf8', function(error, data) {
        var dataArr = data.split(',');
        command = dataArr[0];
        searchName = dataArr[1];
        switch (command) {
            case "my-tweets":
                tweets();
                break;
            case "spotify-this-song":
                spotify();
                break;
            case "movie-this":
                movie();
                break;
        }
    });
}

function appendLog(type) {
    fs.appendFile("log.txt", type + "\n\n" + result + "\n\n------------\n\n", function(err) {
        if (err) {
            return console.log(err);
        }
    });
}


switch (command) {
    case "my-tweets":
        tweets();
        break;
    case "spotify-this-song":
        spotify();
        break;
    case "movie-this":
        movie();
        break;
    case "do-what-it-says":
        says();
        break;
}

if (!command) {
    console.log("You forgot to put in some commands! Here's what you can do:" + '\n' + "1. [my-tweets] to see my tweets." + '\n' + "2. [spotify-this-song] [song-name] to find some info about a song you like." + '\n' + "3. [movie-this] [movie-name] to find some info about a movie you like." + '\n' + "4. [do-what-it-says] to see what random.txt has in store for ya.");
}

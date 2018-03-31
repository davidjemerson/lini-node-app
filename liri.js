require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require('request');
var fs = require("fs");
var nodeArgs = process.argv;
var commands = [];
var nextCommands = [];

for (var i = 2 ; i < nodeArgs.length ; i++) {
	commands.push(nodeArgs[i]);
}

var myTweets = function () {
	var client = new Twitter(keys.twitter);
	client.get("statuses/user_timeline", {screen_name: "justdemerson", count: 20}, function (error, tweets, response) {
		if (error) {
			console.log(error);
		}
		else {
			console.log("Sweet Tweets");
			console.log("------------------");
			for (var i = 0 ; i < tweets.length ; i++) {
				console.log("");
				console.log("Tweet: '" + tweets[i].text + "'");
				console.log("---Date shared: " + tweets[i].created_at);
			}
		}
	});
}

var songInfo = function () {
	var spotify = new Spotify(keys.spotify);
	var songName = "";
	if (!commands[1]) {
		songName = "the distance";
	}
	else {
		for (var i = 1 ; i < commands.length ; i++) {
			songName = songName + commands[i] + " ";
		}
	}
	spotify.search({ type: 'track', query: songName }, function(err, data) {
  		if (err) {
    		return console.log('Error occurred: ' + err);
  		}
  		console.log("--------");
		console.log("Song: " + data.tracks.items[0].name); 
		console.log("Artist: " + data.tracks.items[0].artists[0].name);
		console.log("Album: " + data.tracks.items[0].album.name);
		console.log("Preview Link: " + data.tracks.items[0].preview_url);
	});
}

var movieThis = function () {
	var movieName = "";
	for (var i = 1 ; i < commands.length ; i++) {
		if (i === 1) {
			movieName = commands[i];
		}
		else {
			movieName = movieName + "+" + commands[i];
		}
	}
	
	var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
	request(queryUrl, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log("");
  			console.log("Title: " + JSON.parse(body).Title);
  			console.log("Year: " + JSON.parse(body).Year);
  			console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
  			console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
  			console.log("Country of Production: " + JSON.parse(body).Country);
  			console.log("Language: " + JSON.parse(body).Language);
  			console.log("------");
  			console.log("Plot: " + JSON.parse(body).Plot);
  			console.log("------");
  			console.log("Actors: " + JSON.parse(body).Actors);
  		}
	});
}

var doThing = function () {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return console.log(error);
		}
		commands = data.split(",");
		switch (commands[0]) {
			case "my-tweets":
			myTweets();
			break;

		case "spotify-this-song":
			songInfo();
			break;

		case "movie-this":
			movieThis();
			break;
		}
	});
}

switch (commands[0]) {
	case "my-tweets":
		myTweets();
		break;

	case "spotify-this-song":
		songInfo();
		break;

	case "movie-this":
		movieThis();
		break;

	case "do-what-it-says":
		doThing();
		break;
}
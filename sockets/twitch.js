var config = require('../config')
var request = require('request');

module.exports = function (io) { 
	var twitchData = null;
	var grades = ['E', 'D', 'C', 'B', 'A', 'S'];
	
	// These will be static save the options url
	var headers = {
	  'Accept': 'application/vnd.twitchtv.v3+json',
	  'Client-Id': config.twitchClientId
  };

	// Namespace all activity for this socket
	var twitchSocket = io.of('/twitch');
	
	twitchSocket.on('connection', function (socket) {
		// Log the connection
		console.log('new twitch socket connected: ');
		
		// Get 10 random streams for the initial data
		if (!twitchData)
			refreshData(10);		
		
		// Refresh data when requested
		socket.on('refresh data', function (msg) {
			refreshData(msg.batchSize);
		});
		
		socket.on('request update', function () {
			twitchSocket.emit('update client', twitchData);
		});
		
		// Pulls new data from Twitch
		function refreshData(batchSize) {
			batchSize = batchSize || 1;
			
			var options = {
		    url: config.twitchApiRoot + '/beta/streams/random',
		    method: 'GET',
		    headers: headers
		  };
			
			request(options, function (error, response, body) {
				if (!error && response.statusCode === 200) {
	        var twitchResponse = JSON.parse(body);
					twitchResponse = twitchResponse.streams.slice(0, batchSize);
					processTwitchResponse(twitchResponse);
	      }
			});
		}
		
		// Process Twitch response array into a format that fits the app
		function processTwitchResponse(response) {
			var data = response.map(function (stream) {
				var newO = {};
				
				newO.id = stream._id;
				newO.game = stream.game || 'Untitled Game';
				newO.name = stream.channel.name;
				newO.logo = stream.channel.logo || 'http://gaymerx.com/wp-content/uploads/2013/05/Question-Block.png';
				newO.url = stream.channel.url;
				newO.partner = stream.channel.partner;
				newO.views = stream.channel.views;
				newO.followers = stream.channel.followers;
				newO.stats = {
					viewers: normalizeData(stream.viewers, 'viewers'),
					fps: normalizeData(stream.average_fps, 'fps'),
					resolution: normalizeData(stream.video_height, 'resolution'),
					duration: normalizeData(stream.created_at, 'duration')
				};
				
				return newO;
			});
			
			twitchData = data;
			pushDataToClient();
		}
		
		// Determines a 'power level' for a piece of data based on an arbitrary metric
		function normalizeData(data, dataType) {
			var score = 0;
			
			switch (dataType) {
				case 'viewers':
					// 100 viewers seems reasonable for comparing random streams
					score = data / 100;
					break;
				case 'fps':
					// 60 fps is the obvious choice
					score = data / 60;
					break;
				case 'resolution':
					// 1080p resolution is the best
					score = data / 1080;
					break;
				case 'duration':
					// 3 hour stream duration for maximum points
					var maxTime = 3 * 60 * 60 * 1000;
					var duration = (new Date()).getTime() - Date.parse(data);
					score = duration / maxTime;
					break;
				default:
					score = 0;
					break;
			}
			
			// Scale the score to [0,5]
			score *= 5;
			if (score > 5)
				score = 5;		
			
			return {
				score: score,
				grade: grades[Math.floor(score)]
			};
		}
		
		// Called when components need to be updated
		function pushDataToClient() {
			twitchSocket.emit('update client', twitchData);
		}
	});
};
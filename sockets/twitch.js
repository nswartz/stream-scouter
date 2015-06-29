var config = require('../config')
var request = require('request');

module.exports = function (io) { 
	var twitchData = null;
	
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
			var data = response.map(function (streamObj) {
				return streamObj;
			});
			
			twitchData = data;
			pushDataToClient();
		}
		
		// Called when components need to be updated
		function pushDataToClient() {
			twitchSocket.emit('update client', twitchData);
		}
	});
};
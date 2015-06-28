var config = require('../config')
var request = require('request');

module.exports = function (io) { 
	var twitchData = null;
	
	// These will be static save the options url
	var headers = {
	  'Accept': 'application/vnd.twitchtv.v3+json',
	  'Client-Id': config.twitchClientId
  };
		
  var options = {
    url: '',
    method: 'GET',
    headers: headers
  };
	
	// Namespace all activity for this socket
	var twitchSocket = io.of('/twitch');
	
	twitchSocket.on('connection', function (socket) {
		// Get 10 random streams for the initial data
		if (!twitchData)
			refreshData(10);		
		
		// Refresh data when requested
		socket.on('refresh data', function (msg) {
			refreshData(msg.batchSize);
		});
		
		// Pulls new data from Twitch
		function refreshData(batchSize) {
			batchSize = batchSize || 1;
			
			options.url = config.twitchApiRoot + '/beta/streams/random';
			
			request(options, function (error, response, body) {
				if (!error && response.statusCode === 200) {
	        var twitchResponse = JSON.parse(body);
					twitchResponse = twitchResponse.slice(0, batchSize);
					processTwitchResponse(twitchResponse);
	      }
			});
		}
		
		// Process Twitch response array into a format that fits the app
		function processTwitchResponse(response) {
			var data = response.map(function (stream) {
				return stream;
			});
			
			twitchData = data;
			twitchSocket.emit('data updated', twitchData);
		};
	});
};
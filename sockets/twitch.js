var config = require('../config')
var request = require('request');

module.exports = function (io) { 
	var twitchData = {};
	
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
		updateData(10);
		
		
		
		socket.on('update data', function (msg) {
			updateData(10);
		});
		
		// Pulls new data from Twitch and updates data store
		function updateData(batchSize) {
			batchSize = batchSize || 1;
			
			options.url = config.twitchApiRoot + '/beta/streams/random';
			
			request(options, function (error, response, body) {
				if (!error && response.statusCode === 200) {
	        var twitchResponse = JSON.parse(body);
					twitchResponse = twitchResponse.slice(0, batchSize);
					
	        // TODO: Push data to data store
					console.log(twitchResponse);
	      }
			});
		}
	});
};
var request = require('request');

var config;
if(!process.env.TWITCHID) 
  config = require('../config');


module.exports = function (io) { 
  var twitchData = null;
  var grades = ['E', 'D', 'C', 'B', 'A', 'S'];
  
  // This will be static for the moment
  var headers = {
    'Accept': 'application/vnd.twitchtv.v3+json',
    'Client-Id': process.env.TWITCHID || config.twitchClientId
  };

  // Namespace all activity for this socket
  var twitchSocket = io.of('/twitch');
  
  twitchSocket.on('connection', function (socket) {
    // Log the connection
    console.log('new twitch socket connected: ' + socket.handshake.address);
    
    // Get 40 random streams for the initial data
    if (!twitchData)
      refreshData(40);
    else
      pushDataToClient();    
    
    // Refresh data when requested    
    socket.on('request update', function (batchSize) {
      refreshData(batchSize);
    });
    
    // Pulls new data from Twitch
    function refreshData(batchSize) {
      batchSize = batchSize || 1;
      
      var url = process.env.TWITCHROOT || config.twitchApiRoot;
      var options = {
        url: url + '/beta/streams/random',
        method: 'GET',
        headers: headers
      };
      
      request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var twitchResponse = JSON.parse(body);
          processTwitchResponse(twitchResponse.streams, batchSize);
        }
      });
    }
    
    // Process Twitch response array into a format that fits the app
    function processTwitchResponse(response, batchSize) {
      // Looking at people without profile pics is boring, so filter those out
      var arr = [];
      for (var i=0; i<response.length; i++) {
        if (response[i].channel.logo) {
          arr.push(response[i]);
          
        // We will break out of the loop when the end is reached or
        // when we've found a number of records equal to the batch size
          if (arr.length >= batchSize)
            break;
        }
      }
      
      
      var data = arr.map(function (stream) {
        var newO = {};
        
        newO.id = stream._id;
        newO.game = stream.game || 'Untitled Game';
        newO.name = stream.channel.name;
        newO.logo = stream.channel.logo || 'http://gaymerx.com/wp-content/uploads/2013/05/Question-Block.png';
        newO.url = stream.channel.url;
        newO.partner = stream.channel.partner;
        newO.mature = stream.channel.mature;
        newO.selected = false;
        newO.stats = {
          viewers: normalizeData(stream.viewers, 'Viewers'),
          fps: normalizeData(stream.average_fps, 'FPS'),
          resolution: normalizeData(stream.video_height, 'Resolution'),
          duration: normalizeData(stream.created_at, 'Duration'),
          starPower: normalizeData(0, 'Star Power'),
          views: normalizeData(stream.channel.views, 'Views'),
          followers: normalizeData(stream.channel.followers, 'Followers')
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
        case 'Viewers':
          // 100 viewers seems reasonable for comparing random streams
          score = data / 100;
          break;
        case 'FPS':
          // 60 fps is the obvious choice
          score = data / 60;
          break;
        case 'Resolution':
          // 1080p resolution is the best
          score = data / 1080;
          break;
        case 'Duration':
          // 3 hour stream duration for maximum points
          var hour = 60 * 60 * 1000;
          var duration = (new Date()).getTime() - Date.parse(data);
          data = duration / hour;
          score = duration / (3 * hour);
          break;
        case 'Star Power':
          // Random value between [0,1) (I needed a 5th stat)
          score = Math.random();
          data = score;
          break;      
        case 'Views':
          // Page views are relatively easy to get
          score = data / 10000;
          break;    
        case 'Followers':
          // By contrast, followers are much more difficult
          score = data / 1000;
          break;
        default:
          score = 0;
          break;
      }
      
      // Scale the score to [.5,5]
      score *= 5;
      if (score > 5)
        score = 5;
      else if (score < .5)
        score = .5;   
      
      return {
        score: Math.round(score * 100) / 100,
        grade: grades[Math.floor(score)],
        label: dataType,
        initialValue: Math.round(data * 100) / 100
      };
    }
    
    // Called when components need to be updated
    function pushDataToClient() {
      twitchSocket.emit('update client', twitchData);
    }
  });
};
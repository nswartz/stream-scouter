var React = require('react');
var ScouterApp = require('./components/ScouterApp.react');

var twitchSocket = io('/twitch');

React.render(
  <ScouterApp socket={twitchSocket} />,
  document.getElementById('app-mount')
);
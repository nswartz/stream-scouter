stream-scouter
===========

A small project to compare Twitch streamer data.

View it at https://stream-power-scouter.herokuapp.com/

To run locally:

1. Add a new file in the root of the project called <b>config.js</b>. It should export an object as a module that has the properties:

  `twitchApiRoot= 'https://api.twitch.tv/kraken'`<br/>
  `twitchClientId= <ClientId assigned Twitch>`

2. Install all the dependencies with `npm install`.<br/>
3. Run the app using either of `npm start` or `node bin/www`.

To build the project after making changes, use `npm run build`.<br/>
You can also run `npm run watch` to constantly build when changes are made.

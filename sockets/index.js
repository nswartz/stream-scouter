// Bundle multiple sockets together here
module.exports = function (io) {
  require('./twitch')(io);
};
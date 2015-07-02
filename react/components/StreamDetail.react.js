var React = require('react');
var StreamProfile = require('./StreamProfile.react');
var StatBar = require('./StatBar.react');
var StatGem = require('./StatGem.react');

var StreamDetail = React.createClass({
  getDefaultProps: function () {
    return {
      data: {},
      className: 'right'
    };
  },

  handleGemAnimationComplete: function () {
    // Pass the stream id up the chain
    this.props.onGemAnimationComplete(this.props.data.id);
  },
  render: function () {
    var className = 'streamDetail ' + this.props.className;
    return (
      <div className={className}>
        <StreamProfile data={this.props.data} />
        <StatBar data={this.props.data.stats.views} />
        <StatBar data={this.props.data.stats.followers} />
        <StatGem data={this.props.data.stats} onGemAnimationComplete={this.handleGemAnimationComplete} />
      </div>
    );
  }
});

module.exports = StreamDetail;
var React = require('react');
var StreamDetail = require('./StreamDetail.react');

var StreamComparer = React.createClass({
  getDefaultProps: function () {
    return {
      data: [],
      onGemAnimationComplete: null,
      beginComparison: false,
      onChannelClick: null,
      canDeselect: false,
      // These are the default fields used to compare
      statKeys: ['viewers', 'fps', 'resolution', 'duration', 'starPower'],
      weights: [10000, 2000, 2000, 1500, 1000]
    };
  },

  calculatePowerLevel: function (stats) {
    // Calculates a number based on the stream stats
    var powerLevel = 0;
    this.props.statKeys.forEach(function (key, index) {
      // The scores are already normalized, so then calculate the power
      // based on these arbitrary weights
      powerLevel += stats[key].score * this.props.weights[index];
    }.bind(this));

    return powerLevel;
  },

  render: function () {
    // Render 0-2 detail views
    var count = 0;
    var detailViews = this.props.data.map(function (streamData) {
      count++;
      var className = count == 1 ? 'right' : 'left';
     
      // Only calculate a power level if we can begin comparing
      var powerLevel = 0;
      if (this.props.beginComparison) {
        powerLevel = this.calculatePowerLevel(streamData.stats);
      }     
      return (
        <StreamDetail className={className} key={streamData.id} data={streamData} powerLevel={powerLevel}
        onPowerAnimationComplete={this.props.onPowerAnimationComplete} 
        onGemAnimationComplete={this.props.onGemAnimationComplete} onChannelClick={this.props.onChannelClick} />
      );
    }.bind(this));
    return (
      <div className='streamComparer'>
        {detailViews}
      </div>
    );
  }
});

module.exports = StreamComparer;
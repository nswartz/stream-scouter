var React = require('react');
var Indicator = require('./Indicator.react');
var AppButton = require('./AppButton.react');

var StreamProfile = React.createClass({
  getDefaultProps: function () {
    return {
      data: {},
      onChannelClick: null,
      onPowerAnimationComplete: null,
      powerLevel: 0
    };
  },
  getInitialState: function () {
    return {
      currentLevel: 0,
      powerLevel: 0,
      animating: false
    };
  },

  componentWillReceiveProps: function (newProps) {
    // Start comparing if we have a truthy power level
    if (newProps.powerLevel) {
      this.setState({powerLevel: newProps.powerLevel});
      setTimeout(function () {
        // Bad design, but give the state a moment to update before calling
        this.animatePowerLevel();
      }.bind(this), 100);     
    }    
  },

  animatePowerLevel: function () {
    if (this.state.currentLevel < this.state.powerLevel) {     
      var step = this.state.powerLevel / 200;
      // I don't like the least significant digit staying static aesthetically
      var nextLevel = Math.round(this.state.currentLevel + step + (Math.random() * 10));

      this.setState({currentLevel: nextLevel, animating: true});
      requestAnimationFrame(this.animatePowerLevel);
    } else {
      cancelAnimationFrame(this.animatePowerLevel);
      this.setState({animating: false});
      this.handleAnimationComplete();
    }
  },
  handleAnimationComplete: function () {
    var streamId = this.props.data.id;

    if (!this.state.animating)
      this.props.onPowerAnimationComplete(streamId);
  },
  handleProfileClick: function () {
    var streamId = this.props.data.id;

    // Deselect the stream profile if the picture is clicked
    if (this.props.data.canDeselect && !this.state.animating)
      this.props.onChannelClick(streamId);
  },
  
  render: function () {
    // [Jankily] remove the http://www. from the url for display purposes
    var shortUrl = this.props.data.url.slice(11, Number.MAX_VALUE);

    // Determine if a powerLevel div needs to be included
    var powerLevel;
    if (this.state.currentLevel)
      powerLevel = this.state.currentLevel;
    else
      powerLevel = '';
    
    return (
      <div className='streamProfile'>
        <div className='powerLevel'>
          {powerLevel}
        </div>
        <div className='name'>
          {this.props.data.name}
        </div>
        <div className='logo'>
          <img src={this.props.data.logo} onClick={this.handleProfileClick} />
        </div>  
        <div className='game'>
          playing {this.props.data.game}
        </div>
        <div className='url'>
          on <a href={this.props.data.url}>{shortUrl}</a>
        </div>
        <div className='indicatorContainer'>
          <Indicator label='Partner' active={this.props.data.partner} />
          <Indicator label='Mature' active={this.props.data.mature} />
        </div>
      </div>
    );
  }
});

module.exports = StreamProfile;
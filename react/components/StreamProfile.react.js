var React = require('react');
var Indicator = require('./Indicator.react');
var AppButton = require('./AppButton.react');

var StreamProfile = React.createClass({
  getDefaultProps: function () {
    return {
      data: {},
      onChannelClick: null
    };
  },

  handleProfileClick: function () {
    var streamId = this.props.data.id;

    // Deselect the stream profile if the picture is clicked
    if (this.props.data.canDeselect)
      this.props.onChannelClick(streamId);
  },
  
  render: function () {
    // [Jankily] remove the http://www. from the url for display purposes
    var shortUrl = this.props.data.url.slice(11, Number.MAX_VALUE);
    return (
      <div className='streamProfile'>
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
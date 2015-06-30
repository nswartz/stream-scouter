var React = require('react');
var Indicator = require('./Indicator.react');

var StreamProfile = React.createClass({
  getDefaultProps: function () {
    return {
      data: {}
    };
  },
  
  render: function () {
    // The text-centric piece of the StreamDetail view
    return (
      <div className='streamProfile'>
        <div className='logo'>
          <img src={this.props.data.logo} />
        </div>
        <div className='name'>
          {this.props.data.name}
        </div>
        <div className='game'>
          {this.props.data.game}
        </div>
        <div className='url'>
          {this.props.data.url}
        </div>
        <div>
          <Indicator label='Partner' active={this.props.data.partner} />
          <Indicator label='Mature' active={this.props.data.mature} />
        </div>
      </div>
    );
  }
});

module.exports = StreamProfile;
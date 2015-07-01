var React = require('react');
var StreamList = require('./StreamList.react');

var CenterColumn = React.createClass({
  getInitialState: function () {
    return { 
      data: [] 
    };
  },

  render: function () {
    // Used to contain the streams and buttons the app uses
    return (
      <div className='centerColumn'>
        <div className='appHeader'>Stream Scouter</div>
        <StreamList data={this.props.data} onChannelClick={this.props.onChannelClick} />
      </div>    
    );
  }
});

module.exports = CenterColumn;
var React = require('react');
var StreamList = require('./StreamList.react');
var AppButton = require('./AppButton.react');

var CenterColumn = React.createClass({
  getDefaultProps: function () {
    return {
      onRefreshClick: null,
      onCompareClick: null,
      refreshEnabled: false,
      compareEnabled: false
    };
  },
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
        <AppButton label='Refresh' enabled={this.props.refreshEnabled} onButtonClick={this.props.onRefreshClick} />
        <AppButton label='Compare' enabled={this.props.compareEnabled} onButtonClick={this.props.onCompareClick} />
        <StreamList data={this.props.data} onChannelClick={this.props.onChannelClick} />
      </div>    
    );
  }
});

module.exports = CenterColumn;
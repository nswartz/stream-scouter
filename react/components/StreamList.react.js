var React = require('react');
var SmallStream = require('./SmallStream.react');

var StreamList = React.createClass({
  getDefaultProps: function () {
    return {
      data: []  
    };
  },
  
  render: function () {
    // Create a list of clickable SmallStream components
    var streams = this.props.data.map(function (streamData) {
      return (
        <SmallStream key={streamData.streamId} data={streamData} onChannelClick={this.props.onChannelClick} />
      );
    }.bind(this));
    return (
      <div className='streamList'>
        {streams}
      </div>
    );
  }
});

module.exports = StreamList;
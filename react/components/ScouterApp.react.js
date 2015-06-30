var React = require('react');
var StreamComparer = require('./StreamComparer.react');
var StreamList = require('./StreamList.react');

var ScouterApp = React.createClass({
  getInitialState: function () {
    return { 
      data: [] 
    };
  },
  
  componentWillMount: function () { 
    // Set up our socket that will be used to refresh data    
    this.props.socket.on('update client', function (data) {
      this.setState({data: data});
    }.bind(this));
    // Request the Twitch data through the socket
    this.requestUpdate();
  },

  handleChannelClick: function (streamId) {
    // Find the stream data for the given streamId
    var streamData = this.cloneObject(this.state.data);

    // Find the index of the object clicked on (referenced by streamId)
    var numSelected = 0;
    var index = streamData.map(function (stream) {
      // Because this iterates through the entire array, count selected streams
      if (stream.selected)
        numSelected++;

      return stream.id;
    }).indexOf(streamId);

    // If the stream is selected, unselect it
    // Otherwise select it as long as there are less than 2 already selected
    if (streamData[index].selected) {
      streamData[index].selected = false;
    } else if (!streamData[index].selected && numSelected < 2) {
      streamData[index].selected = true;
    }

    this.setState({data: streamData});
  },

  cloneObject: function (o) {
    // This will return a correct deep copy if the object is composed of primitive values
    return JSON.parse(JSON.stringify(o));
  },
  requestUpdate: function () {
    // Emit a request to the twitch socket to push new data to be rendered
    this.props.socket.emit('request update');
  },

  render: function () {
    // Create an array of data that will be used by the StreamList
    var listData = this.state.data.map(function (streamData) {
      return {
        imgUrl: streamData.logo,
        streamId: streamData.id,
        selected: streamData.selected
      };
    });
    var compareData = this.state.data.filter(function (streamData) {
      return streamData.selected;
    });
    return (
      <div className='scouterApp'>
        <StreamComparer data={compareData} />
        <StreamList data={listData} onChannelClick={this.handleChannelClick} />
      </div>    
    );
  }
});

module.exports = ScouterApp;
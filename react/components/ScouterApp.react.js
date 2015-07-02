var React = require('react');
var StreamComparer = require('./StreamComparer.react');
var CenterColumn = require('./CenterColumn.react');

var ScouterApp = React.createClass({
  getInitialState: function () {
    return { 
      data: [],
      refreshEnabled: false,
      compareEnabled: false,
      canDeselect: []
    };
  },
  
  componentDidMount: function () { 
    // Set up our socket that will be used to refresh data    
    this.props.socket.on('update client', function (data) {
      // When the data comes back, we can populate our state data and enable refresh
      this.setState({data: data, refreshEnabled: true});
    }.bind(this));
    // Request the Twitch data through the socket
    this.requestUpdate();
  },

  handleChannelClick: function (streamId) {
    // Find the stream data for the given streamId
    var streamData = this.cloneObject(this.state.data);

    // Find the index of the object clicked on (referenced by streamId)
    var index = this.getStreamIndexById(streamId);
    var numSelected = this.getSelectedStreams().length;

    // If the stream is selected and it is allowed to be deselected, deselect it
    // Otherwise select it as long as there are less than 2 already selected
    var newDeselect = this.state.canDeselect.slice();
    
    if (streamData[index].selected) {
      streamData[index].selected = false;
      var i = this.state.canDeselect.indexOf(streamId);  
      newDeselect.splice(i, 1);

    } else if (!streamData[index].selected && numSelected < 2) {
      streamData[index].selected = true;
    }

    this.setState({data: streamData, canDeselect: newDeselect});
  },
  handleRefreshClick: function () {
    // Don't want to spam click the refresh while updating
    this.setState({requestEnabled: false});
    this.requestUpdate();
  },
  handleCompareClick: function () {
    // If two streams are selected, we can compare them

  },
  handleGemAnimationComplete: function (streamId) {
    // This should be called when the StatGem finishes animating. It usually takes a while
    // longer, so we can use this function to signal that it is safe to deselect that profile
    var newDeselect = this.state.canDeselect.slice();
    newDeselect.push(streamId);
    this.setState({canDeselect: newDeselect });
  },  
  getSelectedStreams: function () {
    // Returns 0-2 selected streams. Cloned so it is safe to modify them
    var clone = this.cloneObject(this.state.data);
    return clone.filter(function (streamData) {
      return streamData.selected;
    });
  },
  getStreamIndexById: function (streamId) {
    // Find the index of the stream with the given Id
    return this.state.data.map(function (stream) {
      return stream.id;
    }).indexOf(streamId);
  },
  cloneObject: function (o) {
    // This will return a correct deep copy if the object is composed of primitive values
    return JSON.parse(JSON.stringify(o));
  },
  requestUpdate: function () {
    // Emit a request to the twitch socket to push new data to be rendered
    this.props.socket.emit('request update', 40);
  },

  render: function () {
    // Create an array of data that will be used by the StreamList
    var listData = this.state.data.map(function (streamData) {
      return {
        imgUrl: streamData.logo,
        streamId: streamData.id,
        selected: streamData.selected,
        // If the streamId is able to be deselected, set this property to true 
        canDeselect: this.state.canDeselect.indexOf(streamData.id) > -1 ? true : false
      };
    }.bind(this));
    var compareData = this.getSelectedStreams();
    return (
      <div className='scouterApp'>
        <StreamComparer data={compareData} onGemAnimationComplete={this.handleGemAnimationComplete} />
        <CenterColumn data={listData} onChannelClick={this.handleChannelClick} onRefreshClick={this.handleRefreshClick} 
        refreshEnabled={this.state.refreshEnabled} compareEnabled={this.state.compareEnabled} />
      </div>    
    );
  }
});

module.exports = ScouterApp;
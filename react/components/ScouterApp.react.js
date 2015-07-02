var React = require('react');
var StreamComparer = require('./StreamComparer.react');
var CenterColumn = require('./CenterColumn.react');

var ScouterApp = React.createClass({
  getInitialState: function () {
    return { 
      data: [],
      refreshEnabled: false,
      compareEnabled: false,
      beginComparison: false,
      canDeselect: []
    };
  },
  
  componentDidMount: function () { 
    // Set up our socket that will be used to refresh data    
    this.props.socket.on('update client', function (data) {
      // When the data comes back, we can populate our state data
      this.setState({data: data});

     	// Wait a short period before enabling the refresh button
     	setTimeout(function () {
				this.setState({refreshEnabled: true});
     	}.bind(this), 3000); 
    }.bind(this));
  },

  handleChannelClick: function (streamId) {
    // Find the stream data for the given streamId
    var streamData = this.cloneObject(this.state.data);

    // Find the index of the object clicked on (referenced by streamId)
    var index = this.getStreamIndexById(streamId);
    var numSelected = this.getSelectedStreams().length;

    // If the stream is selected and it is allowed to be deselected, deselect it
    // Otherwise select it as long as there are less than 2 already selected
    if (streamData[index].selected) {
      streamData[index].selected = false;
      numSelected--;
      this.removeDeselect(streamId);

    } else if (!streamData[index].selected && numSelected < 2) {
      streamData[index].selected = true;
      numSelected++
    }

    // If there are two streams selected, enable the compare button
    this.setState({data: streamData, compareEnabled: numSelected === 2});
  },
  handleRefreshClick: function () {
    // Don't want to spam click the refresh while updating
    this.setState({refreshEnabled: false});
    this.requestUpdate();
  },
  handleCompareClick: function () {
    // If two streams are selected, we can compare them
    if (this.state.compareEnabled) {
      // Get the selected streams and update canDeselect
      var streams = this.getSelectedStreams();
      streams.forEach(function (stream) {
        this.modifyDeselect(stream.id, 'powerLevel', false);
      }.bind(this));
      this.setState({beginComparison: true});
    }
  },
  handlePowerAnimationComplete: function (streamId) {
    // Power level takes a moment to animate
    this.modifyDeselect(streamId, 'powerLevel', true);
    this.setState({beginComparison: false});
  },
  handleGemAnimationComplete: function (streamId) {
    // This should be called when the StatGem finishes animating. It usually takes a while
    // longer, so we can use this function to signal that it is safe to deselect that profile
    this.modifyDeselect(streamId, 'statGem', true);
  },
  modifyDeselect: function (streamId, key, enabled) {
    // There are several conditons that must be met for a stream to deselect, this function
    // will handle changing that particular state property
    var newDeselect = this.state.canDeselect.slice();
    var index = newDeselect.map(function (streamData) {
      return streamData.id;
    }).indexOf(streamId);

    // If canDeselect does not contain this streamId, then add it
    if (index == -1) {
      var newO = {};
      newO.id = streamId;
      newO[key] = enabled;

      newDeselect.push(newO);
    } else {
      // Otherwise modify the existing object
      newDeselect[index][key] = enabled;
    }

    this.setState({canDeselect: newDeselect});
  },
  removeDeselect: function (streamId) {
    var newDeselect = this.state.canDeselect.filter(function (streamData) {
      // Return all streams not equal to the streamId that will be removed
      return streamData.id != streamId;
    });

    this.setState({canDeselect: newDeselect});
  },
  elementCanBeDeselected: function(streamId) {
    // Returns true if an element had met all the criteria for being deselected
    var streamData = this.state.canDeselect.filter(function (stream) {
      return stream.id == streamId;
    })[0];

    if (streamData) {
      var powerLevel = streamData.hasOwnProperty('powerLevel') ? streamData.powerLevel : true;
      var statGem = streamData.statGem;

      if (statGem && powerLevel)
        return true;
    }
    
    return false;
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
        canDeselect: this.elementCanBeDeselected(streamData.id)
      };
    }.bind(this));
    var compareData = this.getSelectedStreams();
    // Add a flag for whether it is safe to deselect the profile
    compareData.forEach(function (streamData) {
      streamData.canDeselect = this.elementCanBeDeselected(streamData.id);
    }.bind(this));
    return (
      <div className='scouterApp'>
        <StreamComparer data={compareData} onPowerAnimationComplete={this.handlePowerAnimationComplete}
        onGemAnimationComplete={this.handleGemAnimationComplete} 
        beginComparison={this.state.beginComparison} onChannelClick={this.handleChannelClick}/>
        <CenterColumn data={listData} onChannelClick={this.handleChannelClick} onRefreshClick={this.handleRefreshClick} 
        onCompareClick={this.handleCompareClick} refreshEnabled={this.state.refreshEnabled} compareEnabled={this.state.compareEnabled} />
      </div>    
    );
  }
});

module.exports = ScouterApp;
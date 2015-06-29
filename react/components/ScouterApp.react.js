var React = require('react');
var StreamComparer = require('./StreamComparer.react');
var StreamList = require('./StreamList.react');

var ScouterApp = React.createClass({
	getInitialState: function () {
		return { 
			data: [], 
			selected: [] 
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
		// Update the StreamComparer props with the selected stream's data
		if (this.state.selected.length < 2) {
			// Find the stream data for the given streamId
			var streamData = null;
			for (var i=0; i<this.state.data.length; i++) {
				// The streamId from Twitch should be unique, so just return the item
				if (this.state.data[i]._id === streamId) {
					streamData = this.state.data[i];
					break;
				}
			}

			// 'push' the new stream data to our list of selected streams
			if (streamData)	
				this.setState({selected: this.state.selected.concat(streamData)});
		}
	},

	requestUpdate: function () {
		// Emit a request to the twitch socket to push new data to be rendered
		this.props.socket.emit('request update');
	},

	render: function () {
		// Create an array of data that will be used by the StreamList
		var listData = this.state.data.map(function (streamData) {
			return {
				imgUrl: streamData.channel.logo,
				streamId: streamData._id
			};
		});
		return (
			<div className='scouterApp'>
				<StreamComparer selected={this.state.selected} />
				<StreamList data={listData} onChannelClick={this.handleChannelClick} />
			</div>		
		);
	}
});

module.exports = ScouterApp;
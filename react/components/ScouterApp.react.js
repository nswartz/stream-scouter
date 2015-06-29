var React = require('react');
var ComparisonContainer = require('./ComparisonContainer.react');
var ChannelList = require('./ChannelList.react');

var ScouterApp = React.createClass({
	getInitialState: function () {
		return { data: [] };
	},
	
	componentWillMount: function () {	
		// Set up our socket that will be used to refresh data		
		this.props.socket.on('update client', function (data) {
			this.setState({data: data});
		}.bind(this));
		// Request the Twitch data through the socket
		this.requestUpdate();
	},

	handleChannelClick: function (id) {

	},

	requestUpdate: function () {
		// Emit a request to the twitch socket to push new data to be rendered
		this.props.socket.emit('request update');
	},

	render: function () {
		// Create an array of data that will be used by the ChannelList
		var listData = this.state.data.map(function (streamData) {
			return {
				imgUrl: streamData.channel.logo,
				streamId: streamData._id
			};
		});
		return (
			<div className='scouterApp'>
				<ComparisonContainer data={this.state.data} />
				<ChannelList data={listData} onChannelClick={this.handleChannelClick} />
			</div>		
		);
	}
});

module.exports = ScouterApp;
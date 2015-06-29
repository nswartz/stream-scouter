var React = require('react');
var StreamProfile = require('./StreamProfile.react');

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

	requestUpdate: function () {
		this.props.socket.emit('request update');
	},

	render: function () {
		var profiles = this.state.data.map(function (streamData) {
			return(
				<StreamProfile key={streamData._id} data={streamData} />
			);
		});
		return (
			<div className="profileContainer">
				{profiles}
			</div>
		);
	}
});

module.exports = ScouterApp;
var React = require('react');
var SmallChannel = require('./SmallChannel.react');

var ChannelList = React.createClass({
	getDefaultProps: function () {
		return {
			data: []	
		};
	},
	
	render: function () {
		// Create a list of clickable SmallChannel components
		var channels = this.props.data.map(function (channelData) {
			return (
				<SmallChannel data={channelData} onChannelClick={this.props.onChannelClick} />
			);
		}.bind(this));
		return (
			<div className='channelList'>
				{channels}
			</div>
		);
	}
});

module.exports = ChannelList;
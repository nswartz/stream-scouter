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
		var channels = this.props.data.map(function (channelData) {
			var key = 'smallStream' + channelData.streamId;
			return (
				<SmallStream key={key} data={channelData} onChannelClick={this.props.onChannelClick} />
			);
		}.bind(this));
		return (
			<div className='streamList'>
				{channels}
			</div>
		);
	}
});

module.exports = StreamList;
var React = require('react');

var SmallStream = React.createClass({
	getDefaultProps: function () {
		return { 
			data: {
				imgUrl: 'http://gaymerx.com/wp-content/uploads/2013/05/Question-Block.png',
				streamId: 0
			}
		};
	},

	handleClick: function (e) {
		e.preventDefault();

		// Call the passed-in click handler with the streamId
		this.props.onChannelClick(this.props.data.streamId);
	},
	
	render: function () {
		return (
			<div className='smallStream' onClick={this.handleClick}>
				<img src={this.props.data.imgUrl} />
			</div>
		);
	}
});

module.exports = SmallStream;
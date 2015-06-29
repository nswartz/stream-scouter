var React = require('react');

var StreamProfile = React.createClass({
	getDefaultProps: function () {
		return {
			data: { game: 'loading...' },	
		};
	},
	
	render: function () {
		return (
			<div>{this.props.data.game}</div>
		);
	}
});

module.exports = StreamProfile;
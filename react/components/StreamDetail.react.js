var React = require('react');

var StreamDetail = React.createClass({
	getDefaultProps: function () {
		return {
			data: {},	
		};
	},
	
	render: function () {
		var str = JSON.stringify(this.props.data, null, 2);
		return (
			<div>{str}</div>
		);
	}
});

module.exports = StreamDetail;
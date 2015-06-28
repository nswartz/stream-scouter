var React = require('react');

var StreamProfile = React.createClass({
	render: function () {
		return (
			<div className={this.props.key}>{this.props.data.other}</div>
		);
	}
});

module.exports = StreamProfile;
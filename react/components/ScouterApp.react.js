var React = require('react');
var StreamProfile = require('./StreamProfile.react');

var ScouterApp = React.createClass({
	updateChildren: function () {
		// TODO: Request data from data store
		this.setState({data: [{streamId: 00000, other: 'updated'}]});
	},
	getInitialState: function () {
		// TODO: Request data from data store
		return ({
			data: [
				{
					streamId: 123,
					other: 'component 1'
				},
				{
					streamId: 456,
					other: 'component 2'
				},
				{
					streamId: 789,
					other: 'component 3'
				}
			]
		});
	},
	render: function () {
		var profiles = this.state.data.map(function (streamData) {
			return(
				<StreamProfile key={streamData.streamId} data={streamData} />
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
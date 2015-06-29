var React = require('react');
var StreamDetail = require('./StreamDetail.react');

var StreamComparer = React.createClass({
	getDefaultProps: function () {
		return {
			selected: [],	
		};
	},
	
	render: function () {
		// Render 0-2 detail views depending on selected
		var detailViews = this.props.selected.map(function (streamData) {
			return (
				<StreamDetail data={streamData} />
			);
		});
		return (
			<div className='streamComparer'>
				{detailViews}
			</div>
		);
	}
});

module.exports = StreamComparer;
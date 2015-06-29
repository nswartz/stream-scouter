var React = require('react');
var StreamDetail = require('./StreamDetail.react');

var StreamComparer = React.createClass({
	getDefaultProps: function () {
		return {
			data: [],	
		};
	},
	
	render: function () {
		// Render 0-2 detail views
		var count = 0;
		var detailViews = this.props.data.map(function (streamData) {
			count++;
			var className = count == 1 ? 'right' : 'left';
			return (
					<StreamDetail className={className} key={streamData.id} data={streamData} />
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
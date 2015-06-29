var React = require('react');
var StreamDetail = require('./StreamDetail.react');

var StreamComparer = React.createClass({
  getDefaultProps: function () {
    return {
      data: [], 
    };
  },
  
  render: function () {
    // Render 0-2 detail views depending on selected
    var detailViews = this.props.data.map(function (streamData) {
      return (
        <StreamDetail key={streamData.id} data={streamData} />
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
var React = require('react');

var Button = React.createClass({
  getDefaultProps: function () {
    return { 
      data: {
        imgUrl: 'http://gaymerx.com/wp-content/uploads/2013/05/Question-Block.png',
        streamId: 0,
        selected: false
      }
    };
  },

  handleClick: function (e) {
    e.preventDefault();

    // Call the passed-in click handler with the streamId
    this.props.onChannelClick(this.props.data.streamId);
  },
  
  render: function () {
    // Add a class to the element when it is selected
    var className = this.props.data.selected ? 'smallStream selected' : 'smallStream';
    return (
      <div className={className} onClick={this.handleClick}>
        <img src={this.props.data.imgUrl} />
      </div>
    );
  }
});

module.exports = Button;
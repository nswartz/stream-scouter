var React = require('react');

var GradeBubble = React.createClass({
  getDefaultProps: function () {
    return {
      grade: '',
      label: '',
      className: '',
    };
  },
  getInitialState: function () {
    return {
      mouseOver: false
    };
  },

  handleMouseOver: function () {
    this.setState({mouseOver: true});
  },
  handleMouseOut: function () {
    this.setState({mouseOver: false});
  },
  render: function () {
    // Show label based on whether the mouse is over the element
    var label = this.state.mouseOver ? this.props.label : this.props.grade;
    var className = 'gradeBubble ' + this.props.className;

    // Position element at the vertex provided
    var style = {
      left: this.props.positionX,
      top: this.props.positionY
    };
    return (
      <div className={className} onMouseOver={this.handleMouseOver} 
      onMouseOut={this.handleMouseOut} style={style}>
        <div className='label'>
          {label} 
        </div>
      </div>
    );
  }
});

module.exports = GradeBubble;
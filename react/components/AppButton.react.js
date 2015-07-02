var React = require('react');

var AppButton = React.createClass({
  getDefaultProps: function () {
    return { 
      onButtonClick: null,
      enabled: false,
      label: ''
    };
  },
  getInitialState: function () {
    return {
      style: {}
    }
  },

  handleMouseDown: function (e) {
    e.preventDefault();
    var style = {
      boxShadow: 'inset 10px 10px 5px 0px rgba(0,0,0,0.45)'
    }

    if (this.props.enabled)
      this.setState({style: style});
  },
  handleMouseUpOut: function (e) {
    e.preventDefault();

    if (this.props.enabled)
      this.setState({style: {}});
  },
  handleClick: function (e) {
    e.preventDefault();

    // Parent element will determine whether button is enabled
    if (this.props.enabled)
      this.props.onButtonClick();
  },
  render: function () {
    // Add a class to the element when it is selected
    var className = this.props.enabled ? 'appButton ' : 'appButton disabled ';
    className += this.props.label;
    return (
      <div className={className} style={this.state.style} onClick={this.handleClick} 
      onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUpOut} onMouseOut={this.handleMouseUpOut}>
        {this.props.label}
      </div>
    );
  }
});

module.exports = AppButton;
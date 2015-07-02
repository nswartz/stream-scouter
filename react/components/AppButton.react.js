var React = require('react');

var AppButton = React.createClass({
  getDefaultProps: function () {
    return { 
      onButtonClick: null,
      enabled: false,
      label: ''
    };
  },

  handleMouseDown: function (e) {
    e.preventDefault();
  },
  handleMouseUp: function (e) {
    e.preventDefault();
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
      <div className={className} onClick={this.handleClick} 
      onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
        {this.props.label}
      </div>
    );
  }
});

module.exports = AppButton;
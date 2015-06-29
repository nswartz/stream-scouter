var React = require('react');

var Indicator = React.createClass({
  getDefaultProps: function () {
    return {
      label: '',
      active: false 
    };
  },
  
  render: function () {
    // A small indicator where the 'active' class corresponds to its props
    var className = this.props.active ? 'indicator active' : 'indicator';
    return (
      <div className={className}></div>
    );
  }
});

module.exports = Indicator;
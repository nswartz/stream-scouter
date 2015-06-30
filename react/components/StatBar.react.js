var React = require('react');

var StatBar = React.createClass({
  getDefaultProps: function () {
    return {
      data: { 
        score: 0,
        grade: '',
        label: '',
        initialValue: 0
      }
    };
  },
  
  render: function () {
    // A representation of a given stat in a 'meter' format
    return (
      <div className='statBar'>
        <div className='name'>
          {this.props.data.label}
        </div>
        <div className='score'>
          {this.props.data.score}
        </div>
        <div className='initialValue'>
          {this.props.data.initialValue}
        </div>
      </div>
    );
  }
});

module.exports = StatBar;
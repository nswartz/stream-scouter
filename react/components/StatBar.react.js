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
  getInitialState: function () {
    return {
      width: 0,
      mouseOver: false
    }
  },

  componentDidMount: function () {
    this.fillBar();
  },
  
  handleMouseOver: function () {
    this.setState({ismouseOver: true});
  },
  handleMouseOut: function () {
    this.setState({ismouseOver: false});
  },
  fillBar: function () {
    var width = this.state.width;
    // If the bar isn't full, keep animating
    if (width < this.props.data.score*57) {
      this.setState({width: width + 4});
      requestAnimationFrame(this.fillBar);
    } else {
      cancelAnimationFrame(this.fillBar);
    }
  },

  render: function () {
    // A representation of a given stat in a 'meter' format
    var barStyle = {
      width: this.state.width + 'px'
    };

    // Assigns the value of the bar's 'name' field based on mouseover
    var label = this.state.ismouseOver ? this.props.data.initialValue : this.props.data.label;
    return (
      <div className='statBarContainer' onMouseOver={this.handleMouseOver} 
          onMouseOut={this.handleMouseOut}>      
        <div className='name'>
          {label}
        </div>
        <div className='statBar' style={barStyle}>
        </div>    
      </div>     
    );
  }
});

module.exports = StatBar;
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
      width: 0
    }
  },

  componentDidMount: function () {
    this.fillBar();
  },
  
  fillBar: function () {
    var width = this.state.width;
    // If the bar isn't full, keep animating
    if (width < this.props.data.score*100) {
        requestAnimationFrame(this.fillBar);
        this.setState({width: width + 5});
        // 60 fps  
    }
  },
  render: function () {
    // A representation of a given stat in a 'meter' format
    var style = {
      width: this.state.width + 'px'
    };
    return (
      <div>      
        <div className='name'>
          {this.props.data.label}
        </div>
        <div className='statBar' style={style}></div>
        <div className='initialValue'>
          {this.props.data.initialValue}
        </div>
        
      </div>     
    );
  }
});

module.exports = StatBar;
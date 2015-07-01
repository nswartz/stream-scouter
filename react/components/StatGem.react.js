var React = require('react');

var StatGem = React.createClass({
  getDefaultProps: function () {
    return {
      data: {},
      // These are the default stats used to construct a gem. Could be overwritten
      stats: ['viewers', 'fps', 'resolution', 'duration', 'starPower'],
      guides: 'images/StatGemTransparent.png',
      background: 'images/StatGemBackground.png'
    };
  },
  getInitialState: function () {
    // Our gem is 5 sided by default (based on images and props),
    return {
      pathX: [0, 0, 0, 0, 0],
      pathY: [0, 0, 0, 0, 0],
      radius: [0, 0, 0, 0, 0],
      // In radians
      angles: [], 
      animationComplete: false,
      halfWidth: 0,
      halfHeight: 0
    };
  },

  componentDidMount: function () {
    // In order to calculate starting at the top of the pentagon, note that pi/2
    // is the top of the pentagon, and incrementing by (2*pi)/5 will result in the
    // angle (in radians) of the next vertex
    var angles = [];
    var initial = -Math.PI / 2;
    var increment = -(2 * Math.PI) / 5;

    for (var i=0; i < this.props.stats.length; i++) {
      var angle = initial + increment * i;
      angles.push(angle);
    }

    // We will need to use .5 the height/width to offset the clip path as if it was
    // being drawn on a coordinate plane and not from the edge of the element
    var node = React.findDOMNode(this.refs.stats);
    var halfWidth = node.offsetWidth / 2;
    var halfHeight = node.offsetHeight / 2;

    // Can't really avoid a re-render here while using state
    this.setState({angles: angles, halfWidth: halfWidth, halfHeight: halfHeight}, function () {
      // We don't want to begin animating until the state is updated
      this.animatePath();
    }.bind(this));   
  },
  componentWillUnmount: function () {
    cancelAnimationFrame(this.animatePath);
  },

  // These functions return the X/Y coordinates for a given origin, radius, and angle
  calculateX: function (originX, radius, angle) {
    return originX + (radius * Math.cos(angle));
  },
  calculateY: function (originY, radius, angle) {
    return originY + (radius * Math.sin(angle));
  },
  animatePath: function () {
    // This will be responsible for animating in the clip-path for the stats
    if (!this.state.animationComplete) {
      var complete = true;
      var newPathX = [];
      var newPathY = [];
      var newRadius = [];

      for (var i=0; i<this.props.stats.length; i++) {
        var key = this.props.stats[i];
        var r = 0;
        var x = 0;
        var y = 0;

        // If the radius is not maxed out, increment it and recalculate the coordinates
        if (this.state.radius[i] < this.props.data[key].score * 20) {
          r += this.state.radius[i] + 2;
          x = this.calculateX(this.state.halfWidth, r, this.state.angles[i]);
          y = this.calculateY(this.state.halfHeight, r, this.state.angles[i]);
          complete = false;
        }

        // Push the values regardless of whether or not they were changed
        newPathX.push(x ? x : this.state.pathX[i]);
        newPathY.push(y ? y : this.state.pathY[i]);
        newRadius.push(r ? r : this.state.radius[i]);
      }

      this.setState({pathX: newPathX, pathY: newPathY, radius: newRadius, animationComplete: complete});
      requestAnimationFrame(this.animatePath);
    }
  },
  render: function () {
    // A representation of a set of 5 stats given in a 'gem' format
    // This is the progress for the clip path animation. The first and last values will match
    // in order to close the path.
    var coordArray = [];
    for (var i=0; i<this.props.stats.length; i++) {
      var x = this.state.pathX[i] + 'px ';
      var y = this.state.pathY[i] + 'px';
      coordArray.push(x + y);
    }

    // Add the first value onto the end of the array as well, then convert to a string
    //coordArray.push(coordArray[0]);
    var coordinates = coordArray.join(',');    
    var statStyle = {
      WebkitClipPath: 'polygon(' + coordinates + ')'
    };
    return (
      <div className='statGem'>
        <img className='gem' src={this.props.background} />
        <div className='gem stats' style={statStyle} ref='stats'></div>
        <img className='gem' src={this.props.guides} />
      </div>
    );
  }
});

module.exports = StatGem;
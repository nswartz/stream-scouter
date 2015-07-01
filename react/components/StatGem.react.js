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
      // The (x,y) coordinates used to animate the stat gem
      pathX: [],
      pathY: [],
      // The final (x,y) values for each label
      finalX: [],
      finalY: [],
      animationComplete: false
    };
  },

  componentDidMount: function () {
    // In order to calculate starting at the top of the pentagon, note that pi/2
    // is the top of the pentagon, and incrementing by (2*pi)/5 will result in the
    // angle (in radians) of the next vertex
    var angles = [];
    var initial = Math.PI / 2;
    var increment = (2 * Math.PI) / 5;

    // We will need to use .5 the height/width to offset the clip path as if it was
    // being drawn on a coordinate plane and not from the edge of the element
    var node = React.findDOMNode(this.refs.stats);
    var halfWidth = node.offsetWidth / 2;
    var halfHeight = node.offsetHeight / 2;

    // The starting points of the paths need to be in the center of the div
    var pathX = [];
    var pathY = [];

    // Calculate the final values for the pentagon vertices
    var finalX = [];
    var finalY = [];   
    for (var i=0; i < this.props.stats.length; i++) {
      var key = this.props.stats[i];
      var angle = initial + increment * i;

      // The radius is scaled so the resulting animation can stretch to the edge of the pentagon
      var radius = this.props.data[key].score * 20;
      var x = this.calculateX(0, radius, angle);
      var y = this.calculateY(0, radius, angle);

      // Because clip path is used to draw this animation, the 'origin' of the path is the top-left
      // of the div. As a result, all y coordinates will need to be negative to be interpreted
      // as positive. Further, we need to apply an offset (half the relevant div dimension) 
      // to all values so they are positioned as though the center of the div were their origin
      finalX.push(x + halfWidth);
      finalY.push(-y + halfHeight);
      pathX.push(halfWidth);
      pathY.push(halfHeight);
    }

    // Can't really avoid a re-render here while using state
    this.setState({finalX: finalX, finalY: finalY, pathX: pathX, pathY: pathY, halfHeight: halfHeight, halfWidth: halfWidth}, function () {
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
    var complete = true;
    var newPathX = [];
    var newPathY = [];

    // Increment these coordinates if they have not reached their final values
    for (var i=0; i<this.props.stats.length; i++) {
      var x = this.state.pathX[i];
      var y = this.state.pathY[i];

      var finalX = this.state.finalX[i];
      if (this.state.halfWidth < finalX && x < finalX) {
        x += 2;
        complete = false;
      } else if (this.state.halfWidth > finalX && x > finalX) {
        x -= 2;
        complete = false;
      }

      var finalY = this.state.finalY[i];
      if (this.state.halfHeight < finalY && y < finalY) {    
        y += 2;
        complete = false;
      } else if (this.state.halfHeight > finalY && y > finalY) {    
        y -= 2;
        complete = false;
      }

      // Push the values regardless of whether or not they were changed
      newPathX.push(x);
      newPathY.push(y);
    }

    this.setState({pathX: newPathX, pathY: newPathY, animationComplete: complete});

    // Continue looping until the transition is final
    if (!complete)
      requestAnimationFrame(this.animatePath);
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
    coordArray.push(coordArray[0]);
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
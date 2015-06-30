var React = require('react');

var StatGem = React.createClass({
  getDefaultProps: function () {
    return {
      data: {},
      // These are the default stats used to construct a gem. Could be overwritten
      stats: ['viewers', 'fps', 'resolution', 'duration', 'starPower']
    };
  },
  
  render: function () {
    // A representation of a set of 5 stats given in a 'gem' format
    var facets = this.props.stats.map(function (key) {
      var stat = this.props.data[key];
      return (
        <div className='facet'>
          <div className='name'>
            {this.props.data.label}
          </div>
          <div className='score'>
            {this.props.data.score}
          </div>
          <div className='grade'>
            {this.props.data.grade}
          </div>
          <div className='initialValue'>
            {this.props.data.initialValue}
          </div>
        </div>
      );
    }.bind(this));
    return (
      <div className='statGem'>
        {facets}
      </div>
    );
  }
});

module.exports = StatGem;
// require('node-jsx').install();
var express = require('express');

// var React = require('react');
// var ScouterApp = React.createFactory(require('./react/components/ScouterApp'));

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // var app = React.renderToString(ScouterApp());
  // res.render('index', { title: 'Stream Scouter', appContent: "<div>AAYYYY LMAO</div>" });
  res.render('index', { title: 'Stream Scouter' });
});

module.exports = router;

// "<div data-reactid=".q7om1728" data-react-checksum="1534660350">hahahahah</div>"
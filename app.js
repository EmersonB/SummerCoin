var express = require('express');
var path = require('path')
var bodyParser = require('body-parser');
var Bot = require('./bot.js');

var router = express.Router();
var app = express();


app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + '/'));
app.use('/api', router);

app.set('port', process.env.PORT || 8080);
var listener = app.listen(app.get('port'), function() {
  console.log( listener.address().port );
});

app.get('/', function(req, res) {
  res.sendFile(__dirname+'/index.html');
});

app.get('/favicon.ico', function(req, res) {
  res.send("404");
});

var bot = new Bot()

app.get('/:move', function(req, res) {
  res.send(bot.getMove(req.params.move));
});

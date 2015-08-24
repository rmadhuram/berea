var express = require('express'),
  url = require('url'),
  http = require('http'),
  path = require('path');

var app = module.exports = express(),
  dataDir = process.argv[2];

app.set('port', process.env.PORT || 8080);
app.use(express.logger('dev'));

app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'dist')));

var server = http.createServer(app);

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);

io.on('connection', function (socket) {
  console.log('A new display node joined');

  socket.on('disconnect', function(){
    console.log('display node disconnected!');
  });
});

var controller = require('./server/controller');
controller.init(app, io.sockets, dataDir);

// redirect all others to the public/index.html (HTML5 history)
app.get(/^(.*)$/, function(req, res, next){
  res.sendfile(path.join(__dirname, 'dist/index.html'));
});

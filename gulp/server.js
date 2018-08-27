'use strict';

var gulp = require('gulp');
var util = require('util');
var conf = require('./conf');
var connect = require('gulp-connect');


  function createServerTask(name, pre, root) {
    gulp.task(name, pre, function() {

      var express = require('express'),
        url = require('url'),
        http = require('http'),
        path = require('path');

      var app = module.exports = express(),
        dataDir = './data/cci2018';

      app.set('port', process.env.PORT || 8080);
      app.use(express.logger('dev'));

      app.use(express.bodyParser());
      app.use(express.methodOverride());
      root.forEach(p => {
        console.log('add path ' + p)
        app.use(express.static(path.join(__dirname, '../' + p)))
      })

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

      var controller = require('../server/controller');
      controller.init(app, io.sockets, dataDir);

      // redirect all others to the public/index.html (HTML5 history)
      app.get(/^(.*)$/, function(req, res, next){
        res.sendfile(path.join(__dirname, '../' + conf.paths.tmp +'/serve/index.html'));
      });


    });
  }

  createServerTask( 'serve', ['watch'], [ conf.paths.tmp +'/serve', conf.paths.src, './' ]);

  createServerTask( 'serve:dist', ['build'], [ conf.paths.dist ]);

  createServerTask( 'serve:e2e', ['inject'], [ conf.paths.tmp+'/serve', conf.paths.src, './' ]);

  createServerTask( 'serve:e2e-dist', ['build'], [ conf.paths.dist ]);

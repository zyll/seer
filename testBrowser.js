// Required system libraries
var http    = require('http')
  , fs      = require('fs')
  , jade    = require('jade')
  , express = require('express')
  , appAssets  = {
      js: require('./asset/js')
  };
  require('./asset/test_boot').forEach(function(it) {
      AppAssets.js.push(it)
  });


var server = express.createServer(
    express.static(__dirname + '/public')
  , express.static(__dirname + '/test/browser')
  , express.router(function(app) {
      app.get('*', function(req, res, next) {
          fs.readdir(__dirname + '/test/browser', function(err, files) {
              var testsfiles = [];
              files.forEach(function(file, index) {
                var tmp = file.split('.')
                tmp.pop();
                testsfiles.push(tmp.join('.'))
              })
              res.render('test', {
                  layout: false,
                  locals: {
                      appassets: appAssets,
                      tests: testsfiles
                  }});
          })
      });
    })
)

server.set('view engine', 'jade')

server.listen(3012, function() {console.log('Listening on http://127.0.0.1:3012')});

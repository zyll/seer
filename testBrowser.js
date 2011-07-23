// Required system libraries
var http    = require('http')
  , fs      = require('fs')
  , jade    = require('jade')
  , express = require('express')
  , appAssets  = {js: require('./asset/js')}
  , testAssets = {js: require('./asset/test_boot')}

  , server = express.createServer(
        express.static(__dirname + '/public')
      , express.static(__dirname + '/test/browser')
      , express.router(function(app) {
           app.get('/', function(req, res, next) {
               fs.readdir(__dirname + '/test/browser', function(err, files) {
                   var testsFiles = [];
                   files.forEach(function(file) {
                       var tmp = file.split('.')
                       tmp.pop();
                       testsFiles.push(tmp.join('.'))
                   })
                   res.render('test', {
                       layout: false,
                       locals: {
                           testassets: testAssets,
                           appassets: appAssets,
                           tests: testsFiles
                       }});
               })
           });
      })
  )

server.set('view engine', 'jade')

server.listen(3012, function() {console.log('Listening on http://127.0.0.1:3012')});

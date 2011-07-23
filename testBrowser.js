// Required system libraries
var http    = require('http')
  , fs      = require('fs')
  , jade    = require('jade')
  , express = require('express')
  , assetsAll = {
      app: {js: require('./asset/js')}
    , tests: {js: require('./asset/test_boot')}
  }

  // watch on asset to refresh on change
  ;(function(lookedFiles) {
      lookedFiles.forEach(function(looked) {
          fs.watchFile(__dirname + looked.file + '.js', function (curr, prev) {
              delete require.cache[require.resolve('.' + looked.file)]
              assetsAll[looked.asset]  = {js: require('.' + looked.file)}
          })
      })
  }) ([
      {file: '/asset/js', asset: 'app'},
      {file: '/asset/test_boot', asset: 'tests'}
  ])

 var server = express.createServer(
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
                           testassets: assetsAll.tests,
                           appassets: assetsAll.app,
                           tests: testsFiles
                       }});
               })
           });
      })
  )

server.set('view engine', 'jade')

server.listen(3012, function() {console.log('Listening on http://127.0.0.1:3012')});

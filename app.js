// Required system libraries
var http    = require('http')
  , jade    = require('jade')
  , express = require('express')
  , mongoose = require('mongoose')
  , sys = require('sys');

mongoose.connect('mongodb://localhost/testSeer');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var Project = mongoose.model('ProjectSchema', new Schema({
    id     : ObjectId
  , name   : String
  , start  : Number
  , end    : Number
  , cost   : Number
  , visible: Boolean
}));

var server = express.createServer(
    express.static(__dirname + '/public')
  , express.logger()
  , express.bodyParser()
  , express.methodOverride()
  , express.router(function(app) {

      app.post('/projects', function(req, res, next) {
          var p = new Project(req.body)
          p.save(function(err) {
              res.send(p);
          })
      });

      app.put('/projects/:id', function(req, res, next) {
          Project.find({_id: req.params.id}, function(err, docs) {
              if(err || docs.length < 1) {
                  res.send(404);
                  return;
              }
              delete req.body._id;
              docs[0]
                .set(req.body)
                .save(function(err) {
                  res.send(docs[0]);
              })
          });
      });

      app.del('/projects/:id', function(req, res, next) {
          Project.find({_id: req.params.id}, function(err, docs) {
              if(err || docs.length < 1) {
                  res.send(404);
                  return;
              }
              docs[0]
                .remove(function(err) {
                  res.send(204);
              })
          });
      });

      app.get('/projects', function(req, res, next) {
          Project.find({}, function(err, docs) {
              res.send(docs)
          });
      });

      app.get('/projects/:id', function(req, res, next) {
          res.send(Project.find({}), function(err, docs) {
              res.send(docs[0])
          });
      });

    })
)

server.set('view engine', 'jade')

server.error(function(err, req, res) {
    console.log(err.stack)
    res.send('500 Oups'+err, {status: 500})
});

server.listen(3011, function() {console.log('Listening on http://127.0.0.1:3011')});
